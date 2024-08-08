import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/WeatherLanding.css";
import axios from "axios";
import pang from "../../assets/images/pang.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import GoogleLoginButton from "../../components/Landing/GoogleLoginButton";
import pangVideo from "../../assets/videos/pangVideo.mp4";

const apiUrl = process.env.REACT_APP_API_URL;

export default function WeatherLanding({ isLoggedIn }) {
  const locationState = useLocation().state || {};
  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    location: locationState.location || "서울",
    subLocation: locationState.subLocation || "강남구",
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/locations/detail`, {
          params: {
            location: currentLocation.location,
            subLocation: currentLocation.subLocation,
          },
        });

        // Log the entire response and data
        console.log("API Response:", response);
        console.log("Response Data:", response.data);

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
        setLocationError(null);
      } catch (err) {
        console.error(
          "Error fetching weather data:",
          err.response || err.message
        );
        if (
          err.response &&
          err.response.data.message ===
            "주어진 지역의 월평균 데이터가 없습니다."
        ) {
          setLocationError(
            "The monthly average data for the specified area is not available."
          );
        } else {
          setLocationError("Unable to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [currentLocation]);

  const handleLocationChange = (location, subLocation) => {
    setCurrentLocation({ location, subLocation });
    setLoading(true);
  };

  if (loading) return <div className="weather-landing">Loading...</div>;

  if (locationError) {
    return <div className="weather-landing">{locationError}</div>;
  }

  return (
    <div className="weather-landing-container">
      <video
        src={pangVideo}
        type="video/mp4"
        autoPlay
        loop
        muted
        className="weather-landing-video"
      ></video>
      <div className="weather-landing-content">
        <div className="left">
          <h1 className="left-section-title">
            오늘의 공기
            <br />
            괜찮을까요?
          </h1>
          {!isLoggedIn && <GoogleLoginButton />}
        </div>
        <div className="weather-card">
          {weatherData && (
            <>
              <div className="top-section">
                <h2>오늘의 공기정보</h2>
                <div className="location">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#333", marginRight: "12px" }}
                  />
                  {weatherData.city}
                </div>
              </div>
              <div className="second-row">
                <div className="data-item">
                  <h3>이산화황(SO2)</h3>
                  <p>
                    {weatherData.airQuality.so2}
                    <span className="unit"> ppm</span>
                  </p>
                </div>
                <div className="data-item">
                  <h3>일산화탄소(CO)</h3>
                  <p>
                    {weatherData.airQuality.co}
                    <span className="unit"> ppm</span>
                  </p>
                </div>
                <div className="data-item">
                  <h3>오존(O3)</h3>
                  <p>
                    {weatherData.airQuality.o3}
                    <span className="unit"> ppm</span>
                  </p>
                </div>
              </div>
              <div className="third-row">
                <div className="data-item">
                  <h3>이산화질소(NO2)</h3>
                  <p>
                    {weatherData.airQuality.no2}
                    <span className="unit"> ppm</span>
                  </p>
                </div>
                <div className="data-item">
                  <h3>미세먼지(PM10)</h3>
                  <p>
                    {weatherData.airQuality.pm10}
                    <span className="unit"> μg/m³</span>
                  </p>
                </div>
                <div className="data-item">
                  <h3>초미세먼지(PM2.5)</h3>
                  <p>
                    {weatherData.airQuality.pm25}
                    <span className="unit"> μg/m³</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mascot">
          <img src={pang} alt="pang" />
        </div>
      </div>
    </div>
  );
}
