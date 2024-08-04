import React from 'react';

// 임시 더미 데이터
const dummyData = {
  Realtime_Air_Quality: {
    so2: 0.004,
    co: 0.6,
    o3: 0.05,
    no2: 0.03,
    pm10: 25,
    pm25: 18,
    aqi: 85
  }
};

const AirQualityCards = ({ data = dummyData }) => {
  const { so2, co, o3, no2, pm10, pm25 } = data.Realtime_Air_Quality;

  const items = [
    { key: 'so2', label: 'SO₂', name: '(이산화황)', value: so2, unit: 'ppm', max: 0.15 },
    { key: 'co', label: 'CO', name: '(일산화탄소)', value: co, unit: 'ppm', max: 9 },
    { key: 'o3', label: 'O₃', name: '(오존)', value: o3, unit: 'ppm', max: 0.1 },
    { key: 'no2', label: 'NO₂', name: '(이산화질소)', value: no2, unit: 'ppm', max: 0.05 },
    { key: 'pm10', label: 'PM₁₀', name: '(미세먼지)', value: pm10, unit: 'μg/m³', max: 100 },
    { key: 'pm25', label: 'PM₂.₅', name: '(초미세먼지)', value: pm25, unit: 'μg/m³', max: 35 },
  ];

  const getBackgroundColor = (value, max) => {
    const ratio = value / max;
    const r = Math.round(255 * (1 - ratio));
    const g = Math.round(255 * (1 - ratio * 0.5));
    const b = 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const formatValue = (value) => {
    return Number.isInteger(value) ? value : value.toFixed(3);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: '10px', 
      padding: '10px',
      maxWidth: '100%',
    }}>
      {items.map(({ key, label, name, value, unit, max }) => (
        <div
          key={key}
          style={{
            flex: '1 1 150px',
            maxWidth: 'calc(16.66% - 10px)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: getBackgroundColor(value, max),
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '300px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.8em' }}>{label}</h3>
            <p style={{ margin: '0', fontSize: '1.4em' }}>{name}</p>
          </div>
          <div>
            <p style={{ fontSize: '2.5em', fontWeight: 'bold' }}>
              {formatValue(value)}
            </p>
            <p style={{ fontSize: '1.2em' }}>{unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AirQualityCards;