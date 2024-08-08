import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getGrade, calculateScore } from "../../utils/aqi";
import "../../styles/LocationPage.css";
const apiUrl = process.env.REACT_APP_API_URL;

export default function LocationPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const location = query.get("location");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetch(`${apiUrl}/locations/sub?location=${location}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched data:", data);
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [location]);

  const handleMouseEnter = (subLocation, annualMaxAQI, realtimeMaxAQI) => {
    const grade = getGrade(realtimeMaxAQI);
    const score = calculateScore(annualMaxAQI, realtimeMaxAQI);
    setHoveredLocation({ subLocation, grade, score });
  };

  const handleMouseLeave = () => {
    setHoveredLocation(null);
  };

  if (!location) {
    return <p>Invalid location.</p>;
  }

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No data available for this location.</p>;
  }

  return (
    <div className="location-page">
      <h1>{location} 세부지역</h1>
      <p style={{ marginBottom: "60px" }}>세부지역을 선택해주세요!</p>
      <div className="button-container">
        {data &&
          data.map((d, index) => (
            <Link
              key={index}
              to={`/detail?location=${encodeURIComponent(
                location
              )}&subLocation=${encodeURIComponent(d.location)}`}
            >
              <button
                className="location-button"
                onMouseEnter={() =>
                  handleMouseEnter(d.location, d.annualMaxAQI, d.realtimeMaxAQI)
                }
                onMouseLeave={handleMouseLeave}
              >
                {d.location}
              </button>
            </Link>
          ))}
      </div>
      {hoveredLocation && (
        <div className="info-card">
          <h2>
            {location} {hoveredLocation.subLocation}
          </h2>
          <p>대기질 점수: {hoveredLocation.score}</p>
          <p>대기질 등급: {hoveredLocation.grade}</p>
        </div>
      )}
    </div>
  );
}
