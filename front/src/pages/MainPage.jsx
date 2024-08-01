import React from 'react';
import AirQualityChart from "../components/Chart/AirQualityChart"

function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <p>여기가 메인 페이지입니다.</p>
      <div>
          <AirQualityChart />
      </div>
    </div>
  );
}

export default MainPage;
