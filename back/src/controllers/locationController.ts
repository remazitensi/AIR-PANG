import { Request, Response } from 'express';
import { getAnnualData, getRealtimeData, getMonthlyData } from '@_services/locationService';
import type { MonthlyData } from '@_types/location';
import { calculateScore, getGrade, getMaxAQI,MAX_AQI, MIN_AQI } from '@_utils/aqi';

// 지역별 AQI 계산기
export const getLocationDataController = async (req: Request, res: Response) => {
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

      const score = calculateScore(annualMaxAQI, realtimeMaxAQI, MAX_AQI, MIN_AQI);
      const grade = getGrade(realtimeMaxAQI);

      return {
        location: annual.address_b_name,
        annualMaxAQI,
        realtimeMaxAQI,
        score,
        grade,
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
