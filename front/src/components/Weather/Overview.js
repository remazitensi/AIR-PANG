import React, { useState, useEffect } from "react";
import "../styles/Overview.css";
import axios from "axios";
import Forecast from "./Forecast";
import FormattedDate from "./FormattedDate";
import Geolocation from "./Geolocation";

export default function Overview(props) {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [coordinates, setCoordinates] = useState(null);

  function handleResponse(response) {
    console.log(response.data);
    setWeatherData({
      ready: true,
      coordinates: response.data.city.coord,
      description: response.data.list[0].weather[0].description,
      humidity: response.data.list[0].main.humidity,
      wind: response.data.list[0].wind.speed,
      city: response.data.city.name,
      iconUrl: `http://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png`,
      temperature: response.data.list[0].main.temp,
    });
  }

  //geolocation 기능으로 찾은 coords데이터 핸들러
  function handleCoordinatesFound(coords) {
    setCoordinates(coords);
  }

  useEffect(() => {
    if (coordinates) {
      const apiKey = "7c898a2d74a90c04a257c1c3b6c53a94";
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
      axios
        .get(apiUrl)
        .then(handleResponse)
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setWeatherData({ ready: false });
        });
    }
  }, [coordinates]);

  useEffect(() => {
    const apiKey = "7c898a2d74a90c04a257c1c3b6c53a94";
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${props.defaultCity}&appid=${apiKey}&units=metric`;
    axios
      .get(apiUrl)
      .then(handleResponse)
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeatherData({ ready: false });
      });

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.defaultCity]);

  if (weatherData.ready) {
    return (
      <div className="Overview">
        <div className="weather-app-data">
          <div>
            <h2 className="title">일간 날씨예보</h2>
            <div className="weather-app-details">
              <span className="weather-info">
                <FormattedDate date={currentDate} />
                <span className="description"> {weatherData.description}</span>
              </span>
              습도: {weatherData.humidity}%<strong id="humidity"></strong>,
              풍속: {weatherData.wind}km/h
              <strong id="wind-speed"></strong>
            </div>
          </div>

          <div>
            <p className="location">📍</p>
            <h2 className="weather-app-city" id="city">
              {weatherData.city}
            </h2>
            <div>
              <div className="weather-app-temperature-container">
                <img
                  src={weatherData.iconUrl}
                  className="icon"
                  alt="Weather icon"
                />
                <div className="weather-app-temperature" id="temperature">
                  {Math.round(weatherData.temperature)}
                </div>
                <div className="weather-app-unit">°C</div>
              </div>
            </div>
          </div>
        </div>

        <Forecast coordinates={weatherData.coordinates} />
      </div>
    );
  } else {
    return (
      <div className="Overview">
        <Geolocation onLocationFound={handleCoordinatesFound} />
      </div>
    );
  }
}
