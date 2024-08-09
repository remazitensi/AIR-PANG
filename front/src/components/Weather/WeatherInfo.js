import React, { useState, useEffect } from "react";
import Monthly from "../Chart/Monthly";
import AqiTable from "../Chart/AqiTable";
import AirChart from "../Chart/AirChart";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/WeatherInfo.css";
import "../../styles/Monthly.css";
import "../../styles/Air.css";
import cityBackground from "../../assets/images/cityBackground.png";

const apiUrl = process.env.REACT_APP_API_URL;

const DEFAULT_LOCATION = { locationName: "서울", subLocationName: "강남구" };

const WeatherPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialLocation = location.state || DEFAULT_LOCATION;

  const [weatherData, setWeatherData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);

        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        setLocations(storedFavorites);

        const fetchLocationData = async (locationName, subLocationName) => {
          const response = await axios.get(`${apiUrl}/locations/detail`, {
            params: {
              location: locationName,
              subLocation: subLocationName,
            },
          });

          return {
            city: `${response.data.locations.address_a_name}, ${response.data.locations.address_b_name}`,
            airQuality: response.data.Realtime_Air_Quality,
          };
        };

        if (storedFavorites.length === 0) {
          const defaultData = await fetchLocationData(
            DEFAULT_LOCATION.locationName,
            DEFAULT_LOCATION.subLocationName
          );
          setWeatherData([defaultData]);
          setSelectedLocation(defaultData.city);
        } else {
          const data = await Promise.all(
            storedFavorites.map(({ address_a_name, address_b_name }) =>
              fetchLocationData(address_a_name, address_b_name)
            )
          );

          setWeatherData(data);
          const initialSelected = data.find(
            ({ city }) =>
              city ===
              `${initialLocation.locationName}, ${initialLocation.subLocationName}`
          );
          setSelectedLocation(
            initialSelected ? initialSelected.city : data[0].city
          );
        }
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [initialLocation]);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);

    const locationData = weatherData.find(({ city }) => city === newLocation);
    if (locationData) {
      setSelectedLocation(locationData.city);
    }
  };

  if (loading) return <div className="weather-page">Loading...</div>;
  if (error) return <div className="weather-page">{error}</div>;

  const selectedData = weatherData.find(
    ({ city }) => city === selectedLocation
  );

  return (
    <div>
      <div className="weather-page-container">
        <div className="weather-page-top-container">
          <div className="weather-page-top-overlay"></div>
          <h2 className="weather-page-title">
            맑은 공기를 위한 첫걸음 <br />
            공기질 확인하기
          </h2>
          <h3 className="weather-page-sub-title">
            확인하고 싶은 지역을 선택해주세요.
          </h3>

          <div className="favorite-location-selector">
            <select
              id="favorite-location-dropdown"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              {locations.map(({ address_a_name, address_b_name }) => (
                <option
                  key={`${address_a_name}-${address_b_name}`}
                  value={`${address_a_name}, ${address_b_name}`}
                >
                  {address_a_name}, {address_b_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedData && (
          <div className="monthly-info-containers">
            <div className="monthly-flex-container shared-width">
              <Monthly
                locationName={selectedData.city.split(",")[0].trim()}
                subLocationName={selectedData.city.split(",")[1].trim()}
              />
              <AqiTable />
            </div>
            <div className="air-chart-container shared-width">
              <AirChart
                locationName={selectedData.city.split(",")[0].trim()}
                subLocationName={selectedData.city.split(",")[1].trim()}
              />
            </div>
          </div>
        )}
      </div>
      <div className="city-background">
        <img
          src={cityBackground}
          alt="City Background"
          className="city-background-image"
        />
        <h2 className="city-background-title">
          환경을 위한 변화의 시작, <br />
          지금 환경 챌린지에 참여하세요!{" "}
        </h2>
        <button onClick={() => navigate("/challenges")}>챌린지 시작하기</button>
      </div>
    </div>
  );
};

export default WeatherPage;