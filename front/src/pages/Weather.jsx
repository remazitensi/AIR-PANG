import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MonthlyAqi from "../components/Chart/MonthlyAqi";
import AqiTable from "../components/Chart/AqiTable";
import AirQualityChart from "../components/Chart/AirQualityChart";
import axios from "axios";
import "../styles/WeatherInfo.css";
import "../styles/Monthly.css";
import "../styles/Air.css";
import cityBackground from "../assets/images/cityBackground.png";

const apiUrl = process.env.REACT_APP_API_URL;

function Weather({ isLoggedIn, onLogout }) {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await onLogout();
    navigate("/"); // 로그아웃 후 '/' 경로로 이동
  };

  const handleChallengeClick = (event) => {
    if (!isLoggedIn) {
      event.preventDefault(); // 클릭 시 페이지 이동 방지
      alert("로그인 후 환경챌린지를 이용하실 수 있습니다."); // 알림 표시
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const mainLocation = params.get("location");
        const subLocation = params.get("subLocation");

        if (!mainLocation || !subLocation) {
          throw new Error("Invalid location parameters");
        }

        const response = await axios.get(`${apiUrl}/locations/detail`, {
          params: {
            location: mainLocation,
            subLocation: subLocation,
          },
        });

        setLocationData({
          city: `${response.data.locations.address_a_name}, ${response.data.locations.address_b_name}`,
          airQuality: response.data.Realtime_Air_Quality,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="weather-page-container">
      <div className="weather-page-top-container">
        <div className="weather-page-top-overlay"></div>
        <h2 className="weather-page-title">
          맑은 공기를 위한 첫걸음 <br />
          공기질 확인하기
        </h2>
        <h3 className="weather-page-sub-title">
          현재 선택된 지역: {locationData.city}
        </h3>
      </div>

      <div className="monthly-info-containers">
        <div className="monthly-flex-container shared-width">
          <MonthlyAqi
            locationName={locationData.city.split(", ")[0]}
            subLocationName={locationData.city.split(", ")[1]}
          />
          <AqiTable />
        </div>
        <div className="air-chart-container shared-width">
          <AirQualityChart
            data={locationData.airQuality}
            city={locationData.city}
          />
        </div>
      </div>

      <div className="city-background">
        <img
          src={cityBackground}
          alt="City Background"
          className="city-background-image"
        />
        <h2 className="city-background-title">
          환경을 위한 변화의 시작, <br />
          지금 환경 챌린지에 참여하세요!
        </h2>
        <button
              to={isLoggedIn ? "/challenges" : "#"}
              onClick={handleChallengeClick}
            >
              챌린지 시작하기
        </button>
      </div>
    </div>
  );
}

export default Weather;