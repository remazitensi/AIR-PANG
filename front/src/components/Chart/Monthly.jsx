import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
const apiUrl = process.env.REACT_APP_API_URL;

// Chart.js 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAqi = ({ locationName, subLocationName }) => {
  const [monthlyAqi, setMonthlyAqi] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/locations/detail`,
          {
            params: {
              location: locationName,
              subLocation: subLocationName,
            },
          }
        );

        // 현재 연도 기준으로 작년의 1월부터 12월까지 데이터 필터링
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;

        // 월별로 데이터를 그룹화하고 최근 데이터만 추출
        const monthlyData = response.data.monthly_aqi.reduce((acc, item) => {
          const month = parseInt(item.month.split("월")[0], 10);
          if (month >= 1 && month <= 12) {
            acc[month] = item.aqi; // 월별로 마지막 데이터만 저장
          }
          return acc;
        }, {});

        // 월별 데이터 배열로 변환 및 정렬
        const sortedData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1; // 1월부터 12월
          return {
            month: `${month}월`,
            aqi: monthlyData[month] || 0, // 데이터가 없을 경우 기본값 0
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
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  useEffect(() => {
    const chartInstance = chartRef.current;

    // 컴포넌트가 언마운트될 때 차트 인스턴스를 파괴
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h2>월별 AQI 지수</h2>
      <div style={{ position: "relative", height: "400px", width: "600px" }}>
        <Line ref={chartRef} data={data} />
      </div>
    </div>
  );
};

export default MonthlyAqi;
