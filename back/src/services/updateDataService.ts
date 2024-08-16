import axios from 'axios';
import { UpdateDataRepository } from '@_repositories/updateDataRepository';
import { LocationService } from '@_services/locationService';
import type { AirQualityItem } from '@_types/location';
import pool from '@_config/db.config';
import logger from '@_utils/logger';  // winston 로거 가져오기
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const API_KEY = encodeURIComponent(process.env.LOCATION_API_KEY || '');

export class UpdateDataService {
  private updateDataRepository: UpdateDataRepository;
  private locationService: LocationService;

  constructor() {
    this.updateDataRepository = new UpdateDataRepository();
    this.locationService = new LocationService();
  }

  public async fetchAndStoreData(): Promise<void> {
    logger.info('Fetching and storing data process started.');
  
    const locations = await this.locationService.loadAllLocations();
    const provinces = Array.from(new Set(locations.map(loc => loc.address_a_name))); 
  
    try {
      const connection = await pool.getConnection(); // 데이터베이스 연결
      try {
        for (const province of provinces) {
          logger.info(`Fetching real-time data for ${province}.`);
          const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${encodeURIComponent(province)}&searchCondition=DAILY&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}`;
          const response = await axios.get(url);
  
          if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
            throw new Error(`Failed to fetch real-time data for ${province}`); // 데이터가 없으면 바로 에러 발생
          }
  
          const items = response.data.response.body.items || [];
          
          await connection.beginTransaction();

          for (const loc of locations.filter(loc => loc.address_a_name === province)) {
            const item = items.find((it: AirQualityItem) => it.cityName === loc.address_b_name) || {
              pm10Value: 0,
              pm25Value: 0,
              o3Value: 0,
              no2Value: 0,
              coValue: 0,
              so2Value: 0,
              dataTime: new Date().toISOString(),
            };
            
            item.dataTime = dayjs(item.dataTime).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

            await this.updateDataRepository.insertOrUpdateAirQualityData(loc.id, item); // 데이터 삽입
          }
        }
  
        await connection.commit(); 
        logger.info('Successfully fetched and stored data for all regions.');
       } catch (error) {
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
