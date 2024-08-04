import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/WeatherLanding.css";
import axios from "axios";
import pang from "../../assets/images/pang.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";

export default function WeatherLanding() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const location = query.get("location");
  const subLocation = query.get("subLocation");

  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    console.log("location:", location);
    console.log("subLocation:", subLocation);
    if (location && subLocation) {
      fetchWeatherData(location, subLocation);
    } else {
      setLocationError("location or subLocation is missing.");
    }
  }, [location, subLocation]);

  const fetchWeatherData = async (location, subLocation) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/location/detail?location=${encodeURIComponent(
          location
        )}&subLocation=${encodeURIComponent(subLocation)}`
      );

      const data = response.data;

      if (data) {
        setWeatherData({
          city: `${data.locations.address_a_name}, ${data.locations.address_b_name}`,
          airQuality: {
            pm10: data.Realtime_Air_Quality.pm10,
            pm25: data.Realtime_Air_Quality.pm25,
            o3: data.Realtime_Air_Quality.o3,
            no2: data.Realtime_Air_Quality.no2,
            co: data.Realtime_Air_Quality.co,
            so2: data.Realtime_Air_Quality.so2,
            aqi: data.Realtime_Air_Quality.aqi,
          },
        });
        setLocationError(null);
      } else {
        setLocationError("No data available.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          "주어진 지역의 월평균 데이터가 없습니다."
      ) {
        setLocationError(
          "The monthly average data for the specified area is not available."
        );
      } else {
        console.error(
          "Error fetching weather data:",
          error.response || error.message
        );
        setLocationError("Unable to fetch data.");
      }
    }
  };

  if (locationError) {
    return <div className="weather-landing">{locationError}</div>;
  }

  return (
    <div className="weather-landing">
      <div className="left">
        <h1>
          오늘의 공기
          <br />
          괜찮을까요?
        </h1>
      </div>
      <div className="weather-card">
        {weatherData && (
          <>
            <div className="top-section">
              <h2>오늘의 공기정보</h2>
              <div className="location">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "#2e2e2e70", marginRight: "12px" }}
                />
                {weatherData.city}
              </div>
            </div>
            <div className="second-row">
              <div className="data-item">
                <h3>이산화황(SO2)</h3>
                <p>{weatherData.airQuality.so2}</p>
              </div>
              <div className="data-item">
                <h3>일산화탄소(CO)</h3>
                <p>{weatherData.airQuality.co}</p>
              </div>
              <div className="data-item">
                <h3>오존(O3)</h3>
                <p>{weatherData.airQuality.o3}</p>
              </div>
            </div>
            <div className="third-row">
              <div className="data-item">
                <h3>이산화질소(NO2)</h3>
                <p>{weatherData.airQuality.no2}</p>
              </div>
              <div className="data-item">
                <h3>미세먼지(PM10)</h3>
                <p>{weatherData.airQuality.pm10}</p>
              </div>
              <div className="data-item">
                <h3>초미세먼지(PM2.5)</h3>
                <p>{weatherData.airQuality.pm25}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mascot">
        <img src={pang} alt="pang" />
      </div>
    </div>
  );
}
