import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LocationSelector = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSubLocation, setSelectedSubLocation] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/locations/sub?location');
            if (response.data && response.data.locations) {
                setLocations(response.data.locations);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError(err.response ? err.response.data.message : err.message);
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
        return [...new Set(locations.map(locationObj => locationObj.address_a_name))];
    };

    const getSubLocations = (location) => {
        return locations
            .filter(locationObj => locationObj.address_a_name === location)
            .map(locationObj => locationObj.address_b_name);
    };

    if (loading) return <p>Loading locations...</p>;
    if (error) return <p>Error: {error}</p>;

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

            {!selectedLocation || !selectedSubLocation ? (
                <p>위치를 선택해주세요.</p>
            ) : (
                <p>선택한 위치: {selectedLocation}, {selectedSubLocation}</p>
            )}
        </div>
    );
};

export default LocationSelector;