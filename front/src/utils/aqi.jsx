// ./front/src/utils/aqi.js

export const getGrade = (aqi) => {
  if (aqi <= 50) return "좋음";
  if (aqi <= 100) return "보통";
  if (aqi <= 150) return "민감군영향";
  if (aqi <= 200) return "나쁨";
  if (aqi <= 300) return "매우나쁨";
  return "위험";
};

export const calculateScore = (annualMaxAQI, realtimeMaxAQI) => {
  const MAX_AQI = 500;
  const MIN_AQI = 0;
  if (annualMaxAQI >= MAX_AQI || annualMaxAQI <= MIN_AQI) {
    return 0;
  }
  if (realtimeMaxAQI > MAX_AQI || realtimeMaxAQI <= MIN_AQI) {
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
    score = baseScore - ((difference / (MAX_AQI - annualMaxAQI)) * 50);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};
