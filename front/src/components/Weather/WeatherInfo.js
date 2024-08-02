import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MonthlyAqi from "../Chart/MonthlyAqi";

const Weather = () => {
  const [monthlyAqi, setMonthlyAqi] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const locationName = query.get("location");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/locations/detail`,
          {
            params: {
              location: locationName,
            },
          }
        );
        setMonthlyAqi(response.data.monthly_aqi || []);
      } catch (error) {
        console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchWeatherData();
  }, [locationName]);

  // response 맵핑하기
  const data = {
    labels: monthlyAqi.map((item) => item.month),
    datasets: [
      {
        label: "월별 AQI",
        data: monthlyAqi.map((item) => item.aqi),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="weather-page">
      <h1>{locationName}</h1>
      <MonthlyAqi data={data} />
    </div>
  );
};

export default Weather;
