import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Air.css";
import { getGrade, calculateScore } from "../../utils/aqi";

// 메시지 정의
const GRADE_MESSAGES = {
  좋음: "와우! 오늘의 맑은 공기\n마음껏 만끽하세요! 🌿",
  보통: "오늘의 공기는 괜찮아요.\n가끔 신선한 공기를 느껴보세요! 😊",
  민감군영향: "민감군이신 분은\n외출 시 주의해 주세요. 🙂",
  나쁨: "공기 질이 좋지 않아요.\n외출 시 주의하세요! 😕",
  매우나쁨: "매우 나쁜 공기 질입니다.\n외출을 자제하고, 실내에서 지내세요! 🙅🏻‍♂️",
  위험: "위험한 공기 질입니다.\n외출을 피하고 실내에서 안전하게 지내세요! 🚫",
};

const apiUrl = process.env.REACT_APP_API_URL;

// 기본값 설정
const DEFAULT_LOCATION = "서울";
const DEFAULT_SUBLOCATION = "강남구";

const AirChart = ({
  locationName = DEFAULT_LOCATION,
  subLocationName = DEFAULT_SUBLOCATION,
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityInfo, setAirQualityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실시간 대기질 데이터 요청
        console.log("Fetching weather data...");
        const weatherResponse = await axios.get(`${apiUrl}/locations/detail`, {
          params: { location: locationName, subLocation: subLocationName },
        });
        console.log("Weather data response:", weatherResponse.data);

        setWeatherData({
          city: `${weatherResponse.data.locations.address_a_name}, ${weatherResponse.data.locations.address_b_name}`,
          airQuality: weatherResponse.data.Realtime_Air_Quality,
        });

        // 대기질 점수 및 등급 데이터 요청
        console.log("Fetching air quality data...");
        const airQualityResponse = await axios.get(`${apiUrl}/locations/sub`, {
          params: { location: locationName },
        });
        console.log("Air quality data response:", airQualityResponse.data);

        if (airQualityResponse.data && airQualityResponse.data.length > 0) {
          let subLocationData = airQualityResponse.data.find(
            (region) => region.location.trim() === subLocationName.trim()
          );

          if (!subLocationData) {
            subLocationData = airQualityResponse.data.find(
              (region) => region.location.trim() === DEFAULT_SUBLOCATION.trim()
            );
          }

          if (subLocationData) {
            const { annualMaxAQI, realtimeMaxAQI } = subLocationData;
            const score = calculateScore(annualMaxAQI, realtimeMaxAQI);
            const grade = getGrade(realtimeMaxAQI);

            setAirQualityInfo({ grade, score });
          } else {
            setAirQualityInfo({ grade: "정보 없음", score: 0 });
          }
        } else {
          setAirQualityInfo({
            grade: "정보 없음",
            score: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationName, subLocationName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // 등급에 따라 메시지 가져오기
  const gradeMessage = airQualityInfo?.grade
    ? GRADE_MESSAGES[airQualityInfo.grade]
    : "";

  return (
    <div className="weather-info-air-quality-container">
      <div className="weather-info-air-quality-top">
        <h2>오늘의 공기정보</h2>
        <div className="location">
          <FontAwesomeIcon
            icon={faLocationDot}
            style={{ color: "white", marginRight: "12px", fontSize: "32px" }}
          />
          {weatherData?.city}
        </div>
      </div>
      <div className="weather-info-second-row">
        {/* 공기질 데이터 표시 */}
        <div className="weather-info-data-item">
          <h3>
            이산화황
            <br />
            (SO2)
          </h3>
          <p>
            {weatherData?.airQuality.so2}
            <span className="unit">ppm</span>
          </p>
        </div>
        <div className="weather-info-data-item">
          <h3>
            일산화탄소
            <br />
            (CO)
          </h3>
          <p>
            {weatherData?.airQuality.co}
            <span className="unit">ppm</span>
          </p>
        </div>
        <div className="weather-info-data-item">
          <h3>
            오존
            <br />
            (O3)
          </h3>
          <p>
            {weatherData?.airQuality.o3}
            <span className="unit">ppm</span>
          </p>
        </div>
        <div className="weather-info-data-item">
          <h3>
            이산화질소
            <br />
            (NO2)
          </h3>
          <p>
            {weatherData?.airQuality.no2}
            <span className="unit">ppm</span>
          </p>
        </div>
        <div className="weather-info-data-item">
          <h3>
            미세먼지
            <br />
            (PM10)
          </h3>
          <p>
            {weatherData?.airQuality.pm10}
            <span className="unit">ppm</span>
          </p>
        </div>
        <div className="weather-info-data-item">
          <h3>
            초미세먼지
            <br />
            (PM2.5)
          </h3>
          <p>
            {weatherData?.airQuality.pm25}
            <span className="unit">ppm</span>
          </p>
        </div>
        {/* 대기질 점수와 등급 표시 */}
        {airQualityInfo && (
          <div className="weather-info-grade-n-score">
            <div className="weather-info-grade weather-result">
              <h3>대기질 등급</h3>
              <p>{airQualityInfo.grade}</p>
            </div>

            <div className="weather-info-score weather-result">
              <h3>대기질 점수</h3>
              <p>{airQualityInfo.score}</p>
            </div>

            <div className="grade-n-score-message weather-result">
              {/* 등급에 따른 메시지 표시 */}
              {gradeMessage && (
                <p className="grade-message">
                  {gradeMessage.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirChart;
