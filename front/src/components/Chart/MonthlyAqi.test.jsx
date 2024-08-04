import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyAqi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [subLocations, setSubLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSubLocation, setSelectedSubLocation] = useState('');

    useEffect(() => {
        // 사용 가능한 location 목록을 가져오는 함수
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/locations');
                setLocations(response.data);
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        // 선택된 location에 따른 subLocation 목록을 가져오는 함수
        const fetchSubLocations = async () => {
            if (selectedLocation) {
                try {
                    const response = await axios.get(`http://localhost:8080/sublocations/${selectedLocation}`);
                    setSubLocations(response.data);
                } catch (err) {
                    console.error('Error fetching sublocations:', err);
                }
            }
        };

        fetchSubLocations();
    }, [selectedLocation]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedLocation && selectedSubLocation) {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:8080/locations/detail', {
                        params: {
                            location: selectedLocation,
                            subLocation: selectedSubLocation
                        }
                    });
                    setData(response.data);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [selectedLocation, selectedSubLocation]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
        setSelectedSubLocation('');  // Reset subLocation when location changes
    };

    const handleSubLocationChange = (e) => {
        setSelectedSubLocation(e.target.value);
    };

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
            <select value={selectedLocation} onChange={handleLocationChange}>
                <option value="">Select Location</option>
                {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                ))}
            </select>

            <select value={selectedSubLocation} onChange={handleSubLocationChange} disabled={!selectedLocation}>
                <option value="">Select Sub-Location</option>
                {subLocations.map(subLoc => (
                    <option key={subLoc} value={subLoc}>{subLoc}</option>
                ))}
            </select>

            {data && data.monthly_aqi && (
                <div>
                    <h3>{data.locations.address_b_name || 'Unknown Location'}</h3>
                    <div>
                        <h4>최근 12개월 대기질 지수(AQI) 차트</h4>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyAqi;