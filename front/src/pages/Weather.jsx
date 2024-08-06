import React, { useEffect, useState } from "react";
import axios from "axios";
import AirQualityChart from "../components/Chart/AirQualityChart";
// import TestCard from "../components/Chart/TestCard";
import MonthlyAqi from "../components/Chart/MonthlyAqi";
import "../styles/WeatherPage.css";

function Weather() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // URLSearchParams를 사용하여 쿼리 파라미터를 가져옵니다.
        const params = new URLSearchParams(window.location.search);
        const mainLocation = params.get('location');
        const subLocation = params.get('subLocation');

        if (mainLocation && subLocation) {
          const response = await axios.get('http://localhost:8080/locations/detail', {
            params: {
              location: mainLocation,
              subLocation: subLocation,
            }
          });
          setLocationData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="weather-page">
      <h1>우리동네 대기질 정보</h1>
      {locationData && (
        <>
          <MonthlyAqi data={locationData} />
          <AirQualityChart data={locationData} />
          {/* <TestCard /> */}
        </>
      )}
    </div>
  );
}

export default Weather;
