import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LocationSelector = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSubLocation, setSelectedSubLocation] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/locations/detail');
            setLocations(response.data.locations || []);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedLocation && selectedSubLocation) {
            fetchAqiData();
        }
    }, [selectedLocation, selectedSubLocation]);

    const fetchAqiData = async () => {
        setLoading(true);
        try {
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
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
        setSelectedSubLocation('');
    };

    const handleSubLocationChange = (event) => {
        setSelectedSubLocation(event.target.value);
    };

    const getUniqueLocations = () => {
        return [...new Set(locations.map(loc => loc.address_a_name))];
    };

    const getSubLocations = (location) => {
        return locations
            .filter(loc => loc.address_a_name === location)
            .map(loc => loc.address_b_name);
    };

    if (loading && !selectedLocation) return <p>Loading locations...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <select value={selectedLocation} onChange={handleLocationChange}>
                <option value="">주요도시 선택</option>
                {getUniqueLocations().map(location => (
                    <option key={location} value={location}>{location}</option>
                ))}
            </select>

            <select value={selectedSubLocation} onChange={handleSubLocationChange} disabled={!selectedLocation}>
                <option value="">상세도시 선택</option>
                {selectedLocation && getSubLocations(selectedLocation).map(subLocation => (
                    <option key={subLocation} value={subLocation}>{subLocation}</option>
                ))}
            </select>

            {loading && selectedLocation && selectedSubLocation && <p>Loading data...</p>}

            {!selectedLocation || !selectedSubLocation ? (
                <p>위치를 선택해주세요.</p>
            ) : data && data.monthly_aqi ? (
                <Line
                    data={{
                        labels: data.monthly_aqi.map(item => item.month),
                        datasets: [{
                            label: 'Monthly AQI',
                            data: data.monthly_aqi.map(item => item.aqi),
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    }}
                />
            ) : null}
        </div>
    );
};

export default LocationSelector;