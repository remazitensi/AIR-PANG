import pool from '@_config/db.config';
import type { AnnualData, RealtimeData, MonthlyData, CombinedAirQualityData, MainLocationRow, Location } from '@_types/location';

export class LocationRepository {
  // 주요 지역 목록 가져오기
  public async getMainLocations(): Promise<string[]> {
    const query = `
      SELECT DISTINCT address_a_name
      FROM locations
    `;
    try {
      const [results] = await pool.query<MainLocationRow[]>(query);
      return results.map((row) => row.address_a_name);
    } catch (error) {
      throw new Error('주요 지역 목록을 가져오는 중 오류가 발생했습니다.');
    }
  }

  // 모든 위치 데이터 가져오기
  public async getAllLocations(): Promise<Location[]> {
    const query = 'SELECT id, address_a_name, address_b_name FROM locations ORDER BY id ASC';
    try {
      const [results] = await pool.query<Location[]>(query);
      return results;
    } catch (err) {
      throw new Error('위치 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }

  // 지역 별 연평균 대기오염 물질 데이터 가져오기
  public async getAnnualData(location: string): Promise<AnnualData[]> {
    const query = `
      SELECT 
        a.location_id,
        a.pm10_avg AS pm10, 
        a.pm25_avg AS pm25, 
        a.o3_avg AS o3, 
        a.no2_avg AS no2, 
        a.co_avg AS co, 
        a.so2_avg AS so2,
        l.address_b_name
      FROM 
        air_quality a
      JOIN 
        locations l
      ON 
        a.location_id = l.id
      WHERE 
        l.address_a_name = ?
    `;
    try {
      const [results] = await pool.query<AnnualData[]>(query, [location]);
      if (!results || results.length === 0) {
        throw new Error('주어진 지역의 연평균 데이터가 없습니다.');
      }
      return results;
    } catch (error) {
      throw new Error('연평균 대기오염 물질 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }

  // 지역 별 실시간 대기오염 물질 데이터 가져오기
  public async getRealtimeData(location: string): Promise<RealtimeData[]> {
    const query = `
      SELECT 
        r.location_id,
        r.pm10, 
        r.pm25, 
        r.o3, 
        r.no2, 
        r.co, 
        r.so2,
        l.address_b_name
      FROM 
        realtime_air_quality r
      JOIN 
        locations l
      ON 
        r.location_id = l.id
      WHERE 
        l.address_a_name = ?
      ORDER BY 
        r.timestamp DESC
    `;
    try {
      const [results] = await pool.query<RealtimeData[]>(query, [location]);
      if (!results || results.length === 0) {
        throw new Error('주어진 지역의 실시간 데이터가 없습니다.');
      }
      return results;
    } catch (error) {
      throw new Error('실시간 대기오염 물질 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }

  // 지역별 월평균 대기오염 물질 데이터 가져오기
  public async getMonthlyData(location: string, subLocation: string): Promise<MonthlyData> {
    const query = `
      SELECT 
        l.id AS location_id,
        l.address_a_name,
        l.address_b_name,
        r.pm10, 
        r.pm25, 
        r.o3, 
        r.no2, 
        r.co, 
        r.so2,
        r.timestamp,
        m.month,
        m.aqi
      FROM 
        locations l
      LEFT JOIN 
        realtime_air_quality r ON l.id = r.location_id
      LEFT JOIN 
        monthly_aqi m ON l.id = m.location_id
      WHERE 
        l.address_a_name = ? AND l.address_b_name = ?
      ORDER BY 
        r.timestamp DESC, m.month ASC
    `;
    try {
      const [results] = await pool.query<CombinedAirQualityData[]>(query, [location, subLocation]);
      if (!results || results.length === 0) {
        throw new Error('주어진 지역의 월평균 데이터가 없습니다.');
      }
      const airQualityData = results[0];
      const detailedData: MonthlyData = {
        locations: {
          id: airQualityData.location_id,
          address_a_name: airQualityData.address_a_name,
          address_b_name: airQualityData.address_b_name,
        },
        Realtime_Air_Quality: {
          pm10: airQualityData.pm10,
          pm25: airQualityData.pm25,
          o3: airQualityData.o3,
          no2: airQualityData.no2,
          co: airQualityData.co,
          so2: airQualityData.so2,
          aqi: airQualityData.aqi,
        },
        monthly_aqi: results.map(r => ({ month: r.month, aqi: r.aqi })),
      };
      return detailedData;
    } catch (error) {
      throw new Error('월평균 대기오염 물질 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }
}
