import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 컴포넌트 등록
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const MonthlyAqi = ({ data }) => {
  console.log(data);
  // 그래프 옵션 설정
  const options = {
    plugins: {
      title: {
        display: true,
        text: "월별 AQI 지수",
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `AQI: ${tooltipItem.raw}`;
          },
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
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyAqi;
