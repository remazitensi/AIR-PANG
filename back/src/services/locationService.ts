import connection from '@_config/db.config';
import type { AnnualData, RealtimeData, MonthlyData } from '@_types/location';
import { RowDataPacket } from 'mysql2';
import { getMaxAQI } from '@_utils/aqi';

// 지역 별 연평균 대기오염 물질 데이터 가져오는 함수
export const getAnnualData = async (location: string): Promise<AnnualData[]> => {
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
      Air_Quality a
    JOIN 
      Locations l
    ON 
      a.location_id = l.id
    WHERE 
      l.address_a_name = ?
  `;

  try {
    const [results] = await connection.promise().query<AnnualData[] & RowDataPacket[]>(query, [location]);
    if (!results || results.length === 0) {
      throw new Error('주어진 지역의 연평균 데이터가 없습니다.');
    }
    return results;
  } catch (err) {
    throw err;
  }
};

// 지역 별 실시간 대기오염 물질 데이터 가져오는 함수
export const getRealtimeData = async (location: string): Promise<RealtimeData[]> => {
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
      Realtime_Air_Quality r
    JOIN 
      Locations l
    ON 
      r.location_id = l.id
    WHERE 
      l.address_a_name = ?
    ORDER BY 
      r.timestamp DESC
  `;

  try {
    const [results] = await connection.promise().query<RealtimeData[] & RowDataPacket[]>(query, [location]);
    if (!results || results.length === 0) {
      throw new Error('주어진 지역의 실시간 데이터가 없습니다.');
    }
    return results;
  } catch (err) {
    throw err;
  }
};


// 지역별 월평균 대기오염 물질 데이터 가져오는 함수
export const getMonthlyData = async (location: string, subLocation: string): Promise<MonthlyData> => {
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
      Locations l
    LEFT JOIN 
      Realtime_Air_Quality r ON l.id = r.location_id
    LEFT JOIN 
      monthly_aqi m ON l.id = m.location_id
    WHERE 
      l.address_a_name = ? AND l.address_b_name = ?
    ORDER BY 
      r.timestamp DESC, m.month ASC
  `;

  try {
    const [results] = await connection.promise().query<RowDataPacket[]>(query, [location, subLocation]);
    if (!results || results.length === 0) {
      throw new Error('주어진 지역의 월평균 데이터가 없습니다.');
    }
    const airQualityData = results[0] as RealtimeData;
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
        aqi: getMaxAQI(airQualityData),
      },
      monthly_aqi: results.map(r => ({ month: r.month, aqi: r.aqi })),
    };
    return detailedData;
  } catch (err) {
    throw err;
  }
};
