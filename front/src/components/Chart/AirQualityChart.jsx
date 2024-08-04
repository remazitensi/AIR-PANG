import React from "react";

// 임시 더미 데이터
const dummyData = {
  Realtime_Air_Quality: {
    so2: 0.004,
    co: 0.6,
    o3: 0.05,
    no2: 0.03,
    pm10: 25,
    pm25: 18,
    aqi: 85,
  },
};

const AirQualityCards = ({ data = dummyData }) => {
  const { so2, co, o3, no2, pm10, pm25 } = data.Realtime_Air_Quality;

  const items = [
    {
      key: "so2",
      label: "SO₂",
      name: "(이산화황)",
      value: so2,
      unit: "ppm",
      max: 0.15,
    },
    {
      key: "co",
      label: "CO",
      name: "(일산화탄소)",
      value: co,
      unit: "ppm",
      max: 9,
    },
    {
      key: "o3",
      label: "O₃",
      name: "(오존)",
      value: o3,
      unit: "ppm",
      max: 0.1,
    },
    {
      key: "no2",
      label: "NO₂",
      name: "(이산화질소)",
      value: no2,
      unit: "ppm",
      max: 0.05,
    },
    {
      key: "pm10",
      label: "PM₁₀",
      name: "(미세먼지)",
      value: pm10,
      unit: "μg/m³",
      max: 100,
    },
    {
      key: "pm25",
      label: "PM₂.₅",
      name: "(초미세먼지)",
      value: pm25,
      unit: "μg/m³",
      max: 35,
    },
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
    <div
      style={{
        background: "linear-gradient(to right, #fff, #CDEDFF)",
      }}
    >
      <div>
        <h2>항목별 대기정보</h2>
      </div>
      <div
        style={{
          margin: "0",
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          padding: " 70px 50px",
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",

          borderRadius: "20px",
        }}
      >
        {items.map(({ key, label, name, value, unit, max }) => (
          <div
            key={key}
            style={{
              flex: "1 1 150px",
              maxWidth: "calc(16.66% - 10px)",
              padding: "40px 30px",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#fafafa",
              //boxShadow: "0 0px 5px rgba(0,0,0,0.05)",
              transition: "background-color 0.3s ease",
              display: "flex",
              flexDirection: "column",
              //alignItems: "center",
              //justifyContent: "center",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.8em",
                  lineHeight: "1",
                  padding: "0",
                  margin: "0",
                }}
              >
                {label}
              </h3>
              <p style={{ margin: "0", fontSize: "1.2em", lineHeight: "2" }}>
                {name}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "2.5em", fontWeight: "400" }}>
                {formatValue(value)}
              </p>
              <p style={{ fontSize: "1.2em" }}>{unit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityCards;
