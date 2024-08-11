import axios from 'axios';
import cron from 'node-cron';
import pool from '@_config/db.config'; // connection 대신 pool을 사용
import loadLocations from './loadLocations';
import type { AirQualityItem } from '@_types/location';

if (!process.env.LOCATION_API_KEY) {
  throw new Error('LOCATION_API_KEY is not defined');
}

const API_KEY = encodeURIComponent(process.env.LOCATION_API_KEY);

// 타임스탬프를 MySQL에서 인식할 수 있는 형식으로 변환하는 함수
function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
}

const fetchAndStoreData = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection(); // 연결 풀에서 연결을 가져옴
    const locations = await loadLocations();
    const provinces = Array.from(new Set(locations.map(loc => loc.address_a_name))); 

    try {
      for (const province of provinces) {
        console.log(`${province} 실시간 데이터를 가져오는 중 입니다.`); // 도/광역시/자치시/자치도 이름 출력
        const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${encodeURIComponent(province)}&searchCondition=DAILY&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}`;

        const response = await axios.get(url);

        if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
          console.error(`${province} 실시간 데이터를 가져오는 데 실패 했습니다.:`, response.data);
          continue; // 다음 시/도로 넘어감
        }

        const items = response.data.response.body.items || [];

        // 트랜잭션 시작
        await connection.beginTransaction();

        for (const loc of locations.filter(loc => loc.address_a_name === province)) {
          const item = items.find((it: AirQualityItem) => it.cityName === loc.address_b_name) || {
            pm10Value: 0,
            pm25Value: 0,
            o3Value: 0,
            no2Value: 0,
            coValue: 0,
            so2Value: 0,
            dataTime: new Date().toISOString()
          };

          // 각 오염 물질 값이 비어 있는 경우 기본 값 0으로 설정
          const pm10Value = item.pm10Value || 0;
          const pm25Value = item.pm25Value || 0;
          const o3Value = item.o3Value || 0;
          const no2Value = item.no2Value || 0;
          const coValue = item.coValue || 0;
          const so2Value = item.so2Value || 0;
          const dataTime = item.dataTime || new Date().toISOString();

          // 타임스탬프를 MySQL 형식으로 변환(전남 데이터의 타임스탬프 형식 오류를 해결)
          const formattedDataTime = formatTimestamp(dataTime); 

          const query = `
            INSERT INTO realtime_air_quality (location_id, pm10, pm25, o3, no2, co, so2, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              pm10 = VALUES(pm10),
              pm25 = VALUES(pm25),
              o3 = VALUES(o3),
              no2 = VALUES(no2),
              co = VALUES(co),
              so2 = VALUES(so2),
              timestamp = VALUES(timestamp)
          `;

          await connection.query(query, [
            loc.id,
            pm10Value,
            pm25Value,
            o3Value,
            no2Value,
            coValue,
            so2Value,
            formattedDataTime
          ]);
        }

        // 트랜잭션 커밋(성공하면 db에 저장)
        await connection.commit();
        console.log(`${province} 실시간 업데이트를 성공 했습니다.`);
      }

      console.log('모든 지역 데이터를 불러왔습니다.'); // 전체 데이터가 성공적으로 가져와지고 저장되었을 때 메시지 출력
    } catch (error) {
      // 트랜잭션 롤백(에러나면 이전 작업 취소)
      await connection.rollback();
      console.error('데이터 처리 중 오류가 발생하여 트랜잭션이 롤백되었습니다:', error);
    } finally {
      connection.release(); // 연결 반환
    }
  } catch (error) {
    console.error('모든 지역 데이터를 불러오는데 실패 했습니다.:', error);
  }
};

const startCronJob = () => {
  // 24시간마다 실행
  cron.schedule('0 */24 * * *', fetchAndStoreData);

  // 서버 시작할 때도 실행(테스트 할 땐 주석처리)
  // fetchAndStoreData();
};

export default startCronJob;
