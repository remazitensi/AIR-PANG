// ./back/src/utils/aqi.ts

import type { RealtimeData, AnnualData } from '@_types/location';

// AQI 계산 함수
const calculateAQI = (concentration: number, lowerBound: number, upperBound: number, aqiLower: number, aqiUpper: number): number => {
  return ((concentration - lowerBound) / (upperBound - lowerBound)) * (aqiUpper - aqiLower) + aqiLower;
};

export const getMaxAQI = (data: RealtimeData | AnnualData): number => {
  const aqiValues = [
    calculateAQI(data.pm10, 31, 80, 51, 100),
    calculateAQI(data.pm25, 16, 35, 51, 100),
    calculateAQI(data.o3, 0.031, 0.09, 51, 100),
    calculateAQI(data.no2, 0.031, 0.06, 51, 100),
    calculateAQI(data.co, 2.01, 9, 51, 100),
    calculateAQI(data.so2, 0.021, 0.05, 51, 100)
  ];
  return Math.max(...aqiValues);
};
