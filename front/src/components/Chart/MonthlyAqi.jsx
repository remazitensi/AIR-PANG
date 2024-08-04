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

  // Graph options
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

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "AQI",
        data: data.values,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyAqi;
