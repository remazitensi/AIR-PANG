import React, { useEffect, useState } from "react";
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

const monthOrder = {
  "1월": 1,
  "2월": 2,
  "3월": 3,
  "4월": 4,
  "5월": 5,
  "6월": 6,
  "7월": 7,
  "8월": 8,
  "9월": 9,
  "10월": 10,
  "11월": 11,
  "12월": 12,
};

const MonthlyAqi = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  const { monthly_aqi } = data;
  if (!monthly_aqi) return <div>No data available</div>;

  // 최신 12개월 데이터 슬라이싱
  const latestData = monthly_aqi.slice(-12);

  // 월을 숫자로 변환하여 정렬
  latestData.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);

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
        tension: 0.12,
        pointRadius: 5, // 점의 크기
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
          // text: "월",
        },
        grid: {
          display: false, // x축 그리드 없애기
        },
      },
      y: {
        title: {
          display: true,
          text: "AQI",
          // align: "end", // Y축 상단에 위치
          // padding: { top: 10 }, // 위쪽 패딩 조정
        },
        grid: {
          display: false, // y축 그리드 없애기
        },
        beginAtZero: false, // y축 최소범위 설정, true=0
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
