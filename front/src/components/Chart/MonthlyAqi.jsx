import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAqi = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  const { monthly_aqi } = data;
  if (!monthly_aqi) return <div>No data available</div>;

  const latestData = monthly_aqi.slice(-12);
  const months = latestData.map((aqi) => aqi.month);
  const aqiValues = latestData.map((aqi) => aqi.aqi);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "대기질 지수(AQI)",
        data: aqiValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        // fill: true,
        tension: 0.08,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `AQI: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "월",
        },
      },
      y: {
        title: {
          display: true,
          text: "AQI",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
        <h2 style={{
          marginBottom: '40px'
        }}>
          {`${data.locations.address_a_name || "Unknown Location"} ${data.locations.address_b_name || "Unknown Location"}`}
        </h2>
      <div>
        <h2>최근 12개월 대기질 지수(AQI) 차트</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MonthlyAqi;
