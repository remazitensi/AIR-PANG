import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const AirQualityChart = ({ data, city }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="weather-info-air-quality-container">
      <div className="weather-info-air-quality-top">
        <h2 className="weather-page-card-title">오늘의 공기정보</h2>
        <div className="location">
          <FontAwesomeIcon
            icon={faLocationDot}
            style={{
              color: "white",
              marginRight: "12px",
              fontSize: "32px",
            }}
          />
          {city}
        </div>
      </div>
      <div className="weather-info-second-row">
        <div className="weather-info-data-item">
          <h3>이산화황 (SO2)</h3>
          <p>{data.so2}</p>
        </div>
        <div className="weather-info-data-item">
          <h3>일산화탄소 (CO)</h3>
          <p>{data.co}</p>
        </div>
        <div className="weather-info-data-item">
          <h3>오존 (O3)</h3>
          <p>{data.o3}</p>
        </div>
        <div className="weather-info-data-item">
          <h3>이산화질소 (NO2)</h3>
          <p>{data.no2}</p>
        </div>
        <div className="weather-info-data-item">
          <h3>미세먼지 (PM10)</h3>
          <p>{data.pm10}</p>
        </div>
        <div className="weather-info-data-item">
          <h3>초미세먼지 (PM2.5)</h3>
          <p>{data.pm25}</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityChart;
