import { Request, Response } from 'express';
import { getMainLocations, getAnnualData, getRealtimeData, getMonthlyData } from '@_services/locationService';
import type { MonthlyData } from '@_types/location';
import { getMaxAQI } from '@_utils/aqi';

// 주요 지역 평균 AQI 계산기
export const getMainLocationAQIController = async (req: Request, res: Response) => {
  try {
    const mainLocations = await getMainLocations();  // 주요 지역 목록을 동적으로 가져옴

    const results = await Promise.all(mainLocations.map(async (location) => {
      const realtimeData = await getRealtimeData(location);

      if (realtimeData.length === 0) {
        return { location, averageAQI: null };
      }

      const avgAQI = realtimeData.reduce((acc, cur) => acc + getMaxAQI(cur), 0) / realtimeData.length;
      return { location, averageAQI: Math.round(avgAQI) };
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(`주요 지역들의 평균 AQI를 계산하는 데 실패했습니다:`, error);
    res.status(500).send('서버 오류발생');
  }
};

// 세부 지역 AQI 계산기
export const getSubLocationDataController = async (req: Request, res: Response) => {
  const location = req.query.location as string;

  try {
    const [annualData, realtimeData] = await Promise.all([
      getAnnualData(location),
      getRealtimeData(location),
    ]);

    const result = annualData.map((annual) => {
      const realtime = realtimeData.find((r) => r.location_id === annual.location_id);

      const annualMaxAQI = Math.round(getMaxAQI(annual));
      const realtimeMaxAQI = realtime ? Math.round(getMaxAQI(realtime)) : 0;

      return {
        location: annual.address_b_name,
        annualMaxAQI,
        realtimeMaxAQI,
      };
    });

    res.status(200).json(result); 
  } catch (error) {
    console.error(`${location} 연평균 대기오염 물질 데이터를 가져오는데 실패 했습니다:`, error);
    res.status(500).send('서버 오류발생');
  }
};

export const getMonthlyDataController = async (req: Request, res: Response) => {
  const location = req.query.location as string;
  const subLocation = req.query.subLocation as string;

  try {
    const detailedData: MonthlyData = await getMonthlyData(location, subLocation);

    res.status(200).json(detailedData); 
  } catch (error) {
    console.error(`${subLocation} 월평균 대기오염 물질 데이터를 가져오는데 실패 했습니다:`, error);
    res.status(500).send('서버 오류발생'); 
  }
};
