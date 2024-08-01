import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LocationDetail() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const location = query.get('location');
  const subLocation = query.get('subLocation');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (location && subLocation) {
      fetch(`http://localhost:8080/locations/detail?location=${location}&subLocation=${subLocation}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [location, subLocation]);

  if (!location || !subLocation) {
    return <p>Invalid location or subLocation.</p>;
  }

  const getMonthlyData = (monthly_aqi) => {
    const monthOrder = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const uniqueMonthlyData = monthly_aqi.reduce((acc, current) => {
      const x = acc.find(item => item.month === current.month);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return uniqueMonthlyData
      .filter(data => monthOrder.includes(data.month))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  };

  return (
    <div>
      <h2>{subLocation} 데이터</h2>
      {data ? (
        <div>
          <h3>실시간 {subLocation} 대기오염 물질</h3>
          <p>PM10: {data.Realtime_Air_Quality.pm10}</p>
          <p>PM2.5: {data.Realtime_Air_Quality.pm25}</p>
          <p>O3: {data.Realtime_Air_Quality.o3}</p>
          <p>NO2: {data.Realtime_Air_Quality.no2}</p>
          <p>CO: {data.Realtime_Air_Quality.co}</p>
          <p>SO2: {data.Realtime_Air_Quality.so2}</p>

          <h3>{subLocation}의 현재 공기질 지수는?</h3>
          <p>{Math.round(data.Realtime_Air_Quality.aqi)}</p>

          <h3>월별 AQI 변화 추이</h3>
          <ul>
            {getMonthlyData(data.monthly_aqi).map((monthData, index) => (
              <li key={index}>{monthData.month}: {monthData.aqi}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default LocationDetail;
