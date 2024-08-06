import React from "react";
import "../../styles/TestCard.css";

const TestCard = () => {
  return (
    <div className="aqi-card">
      <div className="aqi-card__header">
        <h3 className="aqi-card__title">Last 30 days</h3>
      </div>
      <dl className="aqi-card__table">
        <div className="aqi-card__section">
          <dt className="aqi-card__data-title">Total Subscribers</dt>
          <dd className="aqi-card__contents">71,897</dd>
        </div>
        <div className="aqi-card__section">
          <dt className="aqi-card__data-title">Avg. Open Rate</dt>
          <dd className="aqi-card__contents">58.16%</dd>
        </div>
        <div className="aqi-card__section">
          <dt className="aqi-card__data-title">Avg. Click Rate</dt>
          <dd className="aqi-card__contents">24.57%</dd>
        </div>
      </dl>
    </div>
  );
};


// <div className="aqi-card">
//   <div className="aqi-card__header">
//     <h3 className="aqi-card__title">오늘의 공기정보</h3>
//     <div className="location">
//       <FontAwesomeIcon
//         icon={faLocationDot}
//         style={{ color: "#2e2e2e70", marginRight: "12px" }}
//       />
//       {weatherData.city || "Unknown Location"}
//     </div>
//   </div>
//   <div className="second-row">
//     <div className="data-item">
//       <h3>이산화황(SO2)</h3>
//       <p>{weatherData.airQuality.so2 || "N/A"}</p>
//     </div>
//     <div className="data-item">
//       <h3>일산화탄소(CO)</h3>
//       <p>{weatherData.airQuality.co || "N/A"}</p>
//     </div>
//     <div className="data-item">
//       <h3>오존(O3)</h3>
//       <p>{weatherData.airQuality.o3 || "N/A"}</p>
//     </div>
//   </div>
//   <div className="third-row">
//     <div className="data-item">
//       <h3>이산화질소(NO2)</h3>
//       <p>{weatherData.airQuality.no2 || "N/A"}</p>
//     </div>
//     <div className="data-item">
//       <h3>미세먼지(PM10)</h3>
//       <p>{weatherData.airQuality.pm10 || "N/A"}</p>
//     </div>
//     <div className="data-item">
//       <h3>초미세먼지(PM2.5)</h3>
//       <p>{weatherData.airQuality.pm25 || "N/A"}</p>
//     </div>
//   </div>
// </div>;

// export default TestCard;
