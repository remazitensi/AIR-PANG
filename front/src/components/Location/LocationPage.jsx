import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function LocationPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const location = query.get('location');
  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, location: '', grade: '', score: '', x: 0, y: 0 });

  useEffect(() => {
    if (location) {
      fetch(`http://localhost:8080/locations?location=${location}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [location]);

  const handleMouseEnter = (location, grade, score, event) => {
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

  return (
    <div>
      <h2>{location} 데이터</h2>
      {data ? (
        <div>
          {data.map((d, index) => (
            <Link key={index} to={`/location/detail?location=${location}&subLocation=${d.location}`}>
              <button
                onMouseEnter={(e) => handleMouseEnter(d.location, d.grade, d.score, e)}
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
                top: tooltip.y + 20,
                left: tooltip.x + 20,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              <p>지역: {tooltip.location}</p>
              <p>Grade: {tooltip.grade}</p>
              <p>Score: {tooltip.score}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default LocationPage;
