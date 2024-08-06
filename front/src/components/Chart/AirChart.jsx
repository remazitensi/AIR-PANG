// src/components/AirChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
const apiUrl = process.env.REACT_APP_API_URL;

const AirChart = ({ locationName, subLocationName }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/locations/detail`,
          {
            params: {
              location: locationName,
              subLocation: subLocationName,
            },
          }
        );

        setWeatherData({
          city: `${response.data.locations.address_a_name}, ${response.data.locations.address_b_name}`,
          airQuality: {
            pm10: response.data.Realtime_Air_Quality.pm10,
            pm25: response.data.Realtime_Air_Quality.pm25,
            o3: response.data.Realtime_Air_Quality.o3,
            no2: response.data.Realtime_Air_Quality.no2,
            co: response.data.Realtime_Air_Quality.co,
            so2: response.data.Realtime_Air_Quality.so2,
            aqi: response.data.Realtime_Air_Quality.aqi,
          },
        });
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationName, subLocationName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="weather-card">
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
    </div>
  );
};

export default AirChart;
