import React, { useState, useEffect } from "react";
import "../styles/Forecast.css";
import axios from "axios";

export default function Forecast(props) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState(null);

  useEffect(() => {
    setLoaded(false);
  }, [props.coordinates]);

  function handleResponse(response) {
    setForecast(response.data.list);
    setLoaded(true);
  }

  function formatHour(dt_txt) {
    const date = new Date(dt_txt);
    const hours = date.getHours();
    return `${hours}시`;
  }

  if (loaded) {
    return (
      <div className="Forecast">
        {forecast.map(function (dailyForecast, index) {
          if (index < 8) {
            let weatherIcon = dailyForecast.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            return (
              <div className="Daily" key={index}>
                <div className="forecast-time">
                  {formatHour(forecast[index].dt_txt)}
                </div>
                <img src={iconUrl} style={{ width: "50px", height: "50px" }} />
                <div className="weather-forecast-temperatures">
                  <span className="forecast-temperature">
                    {Math.round(forecast[index].main.temp - 273.15)}°C
                  </span>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  } else {
    let apiKey = "7c898a2d74a90c04a257c1c3b6c53a94";
    let longitude = props.coordinates.lon;
    let latitude = props.coordinates.lat;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    axios.get(apiUrl).then(handleResponse);
  }
}
