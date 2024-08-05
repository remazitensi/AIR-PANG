import React from "react";
import WeatherInfo from "../components/Weather/WeatherInfo";
import "../styles/WeatherInfo.css";

const WeatherPage = () => {
  return (
    <div className="weather-page-container">
      <WeatherInfo />
    </div>
  );
};

export default WeatherPage;
