import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyAqi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const mainLocation = params.get('location');
        const subLocation = params.get('subLocation');

        if (mainLocation && subLocation) {
          const response = await axios.get('http://localhost:8080/locations/detail', {
            params: {
              location: mainLocation,
              subLocation: subLocation,
            }
          });
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Ensure that data exists and is in the expected format
    if (!data || !data.monthly_aqi) {
        return <p>No data available</p>;
    }

        // 최신 12개의 데이터만 사용
        const latestData = data.monthly_aqi.slice(-12);

        // 차트 데이터 준비
        const months = latestData.map(aqi => aqi.month);
        const aqiValues = latestData.map(aqi => aqi.aqi);
    
        const chartData = {
            labels: months,
            datasets: [
                {
                    label: '대기질 지수(AQI)',
                    data: aqiValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.08
                },
            ],
        };
    
        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
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
                        // text: '월',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'AQI',
                    },
                    beginAtZero: true,
                },
            },
        };
    
        return (
            <div>
                <h2>{data.locations.address_a_name || 'Unknown Location'}</h2>
                <h3>{data.locations.address_b_name || 'Unknown Location'}</h3>
                <div>
                    <h4>최근 12개월 대기질 지수(AQI) 차트</h4>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    };
    
    export default MonthlyAqi;


{/* <p>PM10: {data.Realtime_Air_Quality?.pm10 || 'N/A'}</p>
            <p>PM2.5: {data.Realtime_Air_Quality?.pm25 || 'N/A'}</p>
            <p>O3: {data.Realtime_Air_Quality?.o3 || 'N/A'}</p>
            <p>NO2: {data.Realtime_Air_Quality?.no2 || 'N/A'}</p>
            <p>CO: {data.Realtime_Air_Quality?.co || 'N/A'}</p>
            <p>SO2: {data.Realtime_Air_Quality?.so2 || 'N/A'}</p>
            <p>AQI: {data.Realtime_Air_Quality?.aqi || 'N/A'}</p> */}