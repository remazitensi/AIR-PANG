import pool from '@_config/db.config';
import type { AirQualityItem } from '@_types/location';

export class UpdateDataRepository {
  public async insertOrUpdateAirQualityData(locationId: number, item: AirQualityItem): Promise<void> {
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
    // 값이 하나라도 undefined 혹은 null 일 경우 기본값 0으로 설정
    await pool.query(query, [
      locationId,
      item.pm10Value || 0,
      item.pm25Value || 0,
      item.o3Value || 0,
      item.no2Value || 0,
      item.coValue || 0,
      item.so2Value || 0,
      item.dataTime
    ]);
  }
}
