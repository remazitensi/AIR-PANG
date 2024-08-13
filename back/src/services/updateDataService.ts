import axios from 'axios';
import { UpdateDataRepository } from '@_repositories/updateDataRepository';
import { LocationService } from '@_services/locationService';
import type { AirQualityItem } from '@_types/location';
import pool from '@_config/db.config';

const API_KEY = encodeURIComponent(process.env.LOCATION_API_KEY || '');

export class UpdateDataService {
  private updateDataRepository: UpdateDataRepository;
  private locationService: LocationService;

  constructor() {
    this.updateDataRepository = new UpdateDataRepository();
    this.locationService = new LocationService();
  }

  private formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
  }

  public async fetchAndStoreData(): Promise<void> {
    const locations = await this.locationService.loadAllLocations();
    const provinces = Array.from(new Set(locations.map(loc => loc.address_a_name)));

    try {
      const connection = await pool.getConnection();
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

            const formattedDataTime = this.formatTimestamp(item.dataTime);

            await this.updateDataRepository.insertOrUpdateAirQualityData(loc.id, item, formattedDataTime);
          }

          // 트랜잭션 커밋
          await connection.commit();
          console.log(`${province} 실시간 업데이트를 성공 했습니다.`);
        }

        console.log('모든 지역 데이터를 불러왔습니다.');
      } catch (error) {
        // 트랜잭션 롤백
        await connection.rollback();
        console.error('데이터 처리 중 오류가 발생하여 트랜잭션이 롤백되었습니다:', error);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('모든 지역 데이터를 불러오는데 실패 했습니다.:', error);
    }
  }
}
