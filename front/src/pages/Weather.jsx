import React from "react";
import AirQualityChart from "../components/Chart/AirQualityChart";
import MonthlyAqi from "../components/Chart/MonthlyAqi";

function Weather({ locationData }) {
  return (
    <div>
      <h1>날씨정보 페이지</h1>
      <p>여기가 날씨정보 페이지입니다.</p>
      <div>
        {locationData && <MonthlyAqi data={locationData.monthly_aqi} />}
        <AirQualityChart />
      </div>
    </div>
  );
}

export default Weather;
