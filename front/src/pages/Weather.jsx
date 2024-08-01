import React from 'react';
import AirQualityChart from "../components/Chart/AirQualityChart";

function Weather() {
  return (
    <div>
      <h1>날씨정보 페이지</h1>
      <p>여기가 날씨정보 페이지입니다.</p>
      <div>
          <AirQualityChart />
      </div>
    </div>
  );
}

export default Weather;
