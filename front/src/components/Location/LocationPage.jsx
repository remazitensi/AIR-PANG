import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getGrade, calculateScore } from '../../utils/aqi';
import '../../styles/LocationPage.css';
const apiUrl = process.env.REACT_APP_API_URL;

function LocationPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const location = query.get('location');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, location: '', grade: '', score: '', x: 0, y: 0 });

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetch(`${apiUrl}/locations/sub?location=${location}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched data:', data); // 데이터 로그 추가
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [location]);

  const handleMouseEnter = (location, annualMaxAQI, realtimeMaxAQI, event) => {
    const grade = getGrade(realtimeMaxAQI);
    const score = calculateScore(annualMaxAQI, realtimeMaxAQI);
    setTooltip({
      show: true,
      location,
      grade,
      score,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, location: '', grade: '', score: '', x: 0, y: 0 });
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
      <h2>{location} 데이터</h2>
      <div className="button-container">
        {data && data.map((d, index) => (
          <Link
            key={index}
            to={`/detail?location=${encodeURIComponent(location)}&subLocation=${encodeURIComponent(d.location)}`}
          >
            <button
              className="location-button"
              onMouseEnter={(e) => handleMouseEnter(d.location, d.annualMaxAQI, d.realtimeMaxAQI, e)}
              onMouseLeave={handleMouseLeave}
            >
              {d.location}
            </button>
          </Link>
        ))}
        {tooltip.show && (
          <div
            style={{
              position: 'absolute',
              top: tooltip.y + 45,
              left: tooltip.x + 30,
              backgroundColor: 'rgba(231, 246, 255, 0.70)',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
            }} // 버튼 모양 인라인 스타일링
          >
            <p>지역: {tooltip.location}</p>
            <p>Grade: {tooltip.grade}</p>
            <p>Score: {tooltip.score}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPage;
