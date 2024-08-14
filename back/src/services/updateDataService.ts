import axios from 'axios';
import { UpdateDataRepository } from '@_repositories/updateDataRepository';
import { LocationService } from '@_services/locationService';
import type { AirQualityItem } from '@_types/location';
import pool from '@_config/db.config';
import logger from '@_utils/logger';  // winston 로거 가져오기

const API_KEY = encodeURIComponent(process.env.LOCATION_API_KEY || '');

export class UpdateDataService {
  private updateDataRepository: UpdateDataRepository;
  private locationService: LocationService;

  constructor() {
    this.updateDataRepository = new UpdateDataRepository();
    this.locationService = new LocationService();
  }

  private formatTimestamp(timestamp: string): string {   // 타임스탬프 YYYY-MM-DD HH:MM:SS 로 변환
  const date = new Date(timestamp);
  const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);  // 한국 시간으로 변환 (UTC + 9시간)
  return koreaTime.toISOString().slice(0, 19).replace('T', ' ');
}

  public async fetchAndStoreData(): Promise<void> {
    logger.info('Fetching and storing data process started.');
    //locations 테이블의 모든 값들 객체 배열
    const locations = await this.locationService.loadAllLocations();
    //locaitons 테이블의 address_a_name 들만 추출, set은 address_a_name 중복을 막기 위함, Array.from은 객체를 다시 배열로 돌리기 위함 
    const provinces = Array.from(new Set(locations.map(loc => loc.address_a_name))); 

    try {
      const connection = await pool.getConnection();
      try {
        for (const province of provinces) {
          logger.info(`Fetching real-time data for ${province}.`);
          const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${encodeURIComponent(province)}&searchCondition=DAILY&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}`;

          const response = await axios.get(url);

          if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
            logger.error(`Failed to fetch real-time data for ${province}:`, response.data);
            continue; // 다음 시/도로 넘어감
          }

          const items = response.data.response.body.items || [];

          // 트랜잭션 시작
          await connection.beginTransaction();

          for (const loc of locations.filter(loc => loc.address_a_name === province)) { //address_a_name이 province인 지역을 필터링
            const item = items.find((it: AirQualityItem) => it.cityName === loc.address_b_name) || { // items 배열에서 'cityName' 이 현재 'loc.address_b_name' 과 일치하는 첫 번째 item 객체를 찾음
              pm10Value: 0, // 기본값을 0으로 설정
              pm25Value: 0,
              o3Value: 0,
              no2Value: 0,
              coValue: 0,
              so2Value: 0,
              dataTime: new Date().toISOString()
            };

            const formattedDataTime = this.formatTimestamp(item.dataTime); // 타임스탬프 변환 적용

            await this.updateDataRepository.insertOrUpdateAirQualityData(loc.id, item, formattedDataTime); // openAPI에서 추출한 대기오염 물질 db에 저장
          }

          // 트랜잭션 커밋
          await connection.commit();
          logger.info(`Successfully updated real-time data for ${province}.`);
        }

        logger.info('Successfully fetched and stored data for all regions.');
      } catch (error) {
        // 트랜잭션 롤백
        await connection.rollback();
        logger.error('An error occurred during data processing, transaction has been rolled back:', error);
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error('Failed to fetch and store data for all regions:', error);
    }
  }
}
