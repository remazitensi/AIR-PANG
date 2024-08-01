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

export const MAX_AQI = 500;
export const MIN_AQI = 0;

export const calculateScore = (annualMaxAQI: number, realtimeMaxAQI: number, maxAQI: number, minAQI: number): number => {
  if (annualMaxAQI >= maxAQI || annualMaxAQI <= minAQI) {
    return 0;
  }
  if (realtimeMaxAQI > maxAQI || realtimeMaxAQI <= minAQI) {
    return 0;
  }

  const baseScore = 50;
  const difference = realtimeMaxAQI - annualMaxAQI;
  let score;
  
  if (difference === 0) {
    score = baseScore;
  } else if (difference < 0) {
    score = baseScore + ((-difference / annualMaxAQI) * 50);
  } else {
    score = baseScore - ((difference / (maxAQI - annualMaxAQI)) * 50);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

export enum Grade {
  GOOD = "좋음",
  MODERATE = "보통",
  UNHEALTHY_FOR_SENSITIVE_GROUPS = "민감군영향",
  UNHEALTHY = "나쁨",
  VERY_UNHEALTHY = "매우나쁨",
  HAZARDOUS = "위험"
}

export const getGrade = (aqi: number): Grade => {
  if (aqi <= 50) return Grade.GOOD;
  if (aqi <= 100) return Grade.MODERATE;
  if (aqi <= 150) return Grade.UNHEALTHY_FOR_SENSITIVE_GROUPS;
  if (aqi <= 200) return Grade.UNHEALTHY;
  if (aqi <= 300) return Grade.VERY_UNHEALTHY;
  return Grade.HAZARDOUS;
};
