import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const AirQualityChart = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const weatherData = {
    city: `${data.locations.address_a_name}, ${data.locations.address_b_name}`,
    airQuality: {
      so2: data.Realtime_Air_Quality.so2,
      co: data.Realtime_Air_Quality.co,
      o3: data.Realtime_Air_Quality.o3,
      no2: data.Realtime_Air_Quality.no2,
      pm10: data.Realtime_Air_Quality.pm10,
      pm25: data.Realtime_Air_Quality.pm25,
      aqi: data.Realtime_Air_Quality.aqi,
    },
  };

  return (
    <div className="aqi-card">
      <div className="aqi-card__header">
        <h3 className="aqi-card__title">오늘의 공기정보</h3>
      </div>
      <div className="aqi-card__table">
        <div className="aqi-card__section">
          <dt className="aqi-card__data-title">이산화황(SO2)</dt>
          <dd className="aqi-card__contents">{weatherData.airQuality.so2 || "N/A"}</dd>
        </div>
        <div className="data-item">
          <h3>일산화탄소(CO)</h3>
          <p>{weatherData.airQuality.co || "N/A"}</p>
        </div>
        <div className="data-item">
          <h3>오존(O3)</h3>
          <p>{weatherData.airQuality.o3 || "N/A"}</p>
        </div>
      </div>
      <div className="aqi-card__section">
        <div className="data-item">
        <h3>이산화질소(NO2)</h3>
        <p>{weatherData.airQuality.no2 || "N/A"}</p>
        </div>
      <div className="data-item">
        <h3>미세먼지(PM10)</h3>
        <p>{weatherData.airQuality.pm10 || "N/A"}</p>
        </div>
      <div className="data-item">
        <h3>초미세먼지(PM2.5)</h3>
        <p>{weatherData.airQuality.pm25 || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityChart;
