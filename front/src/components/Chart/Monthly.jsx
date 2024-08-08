import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../styles/Monthly.css";
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
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and the data labels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const apiUrl = process.env.REACT_APP_API_URL;

const MonthlyAqi = ({ locationName, subLocationName }) => {
  const [monthlyAqi, setMonthlyAqi] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/locations/detail`, {
          params: {
            location: locationName,
            subLocation: subLocationName,
          },
        });

        const currentYear = new Date().getFullYear();

        const monthlyData = response.data.monthly_aqi.reduce((acc, item) => {
          const month = parseInt(item.month.split("월")[0], 10);
          if (month >= 1 && month <= 12) {
            acc[month] = item.aqi;
          }
          return acc;
        }, {});

        const sortedData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          return {
            month: `${month}월`,
            aqi: monthlyData[month] || 0,
          };
        });

        setMonthlyAqi(sortedData);
      } catch (err) {
        console.error("Error fetching AQI data:", err);
      }
    };

    fetchAqiData();
  }, [locationName, subLocationName]);

  const data = {
    labels: monthlyAqi.map((item) => item.month),
    datasets: [
      {
        label: "AQI",
        data: monthlyAqi.map((item) => item.aqi),
        fill: false,
        borderColor: "#9FB2BD",
        tension: 0,
        pointRadius: 8,
        pointHoverRadius: 10,
        datalabels: {
          color: "#000",
          font: {
            size: 20,
          },
          anchor: "end",
          align: "top",
          offset: 5,
          formatter: (value) => value,
        },
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 20,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
        bodyFont: {
          size: 20,
        },
      },
      datalabels: {
        color: "#000",
        font: {
          size: 14,
        },
        formatter: (value) => value,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0)",
        },
        ticks: {
          font: {
            size: 18,
          },
        },
      },
      y: {
        type: "linear",
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.2)",
          drawOnChartArea: true,
        },
        ticks: {
          font: {
            size: 18,
          },
          callback: (value) => {
            if (value === 0) return "매우";
            if (value === 50) return "나쁨";
            if (value === 100) return "보통";
            if (value === 250) return "좋음";
            return "";
          },
        },
        min: 0,
        max: 250,
      },
      y2: {
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 18,
          },
          callback: (value) => {
            if (value === 0) return "0";
            if (value === 50) return "51";
            if (value === 101) return "101";
            if (value === 251) return "251";
            return "";
          },
        },
        min: 0,
        max: 300,
      },
    },
  };

  useEffect(() => {
    const chartInstance = chartRef.current;

    // Clean up the chart instance on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="monthly-chart-container">
      <h2 className="monthly-chart-container-title">
        월별 통합 AQI 변화 추이 (작년 기준)
      </h2>
      <div className="chart-wrapper">
        <Line ref={chartRef} data={data} options={options} />
        <div className="chart-background" />
      </div>
    </div>
  );
};

export default MonthlyAqi;
