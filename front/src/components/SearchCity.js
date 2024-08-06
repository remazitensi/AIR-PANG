import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SearchCity.css";
import pangVideo from "../assets/videos/pangVideo.mp4";
import pang from "../assets/images/pang.png";
const apiUrl = process.env.REACT_APP_API_URL;

const locationsList = [
  "서울",
  "경기",
  "강원",
  "광주",
  "인천",
  "전남",
  "전북",
  "경북",
  "경남",
  "세종",
  "제주",
  "충북",
  "충남",
  "대전",
  "대구",
  "부산",
  "울산",
];

const Search = () => {
  const [location, setLocation] = useState("");
  const [subLocation, setSubLocation] = useState("");
  const [subLocations, setSubLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setSubLocation("");
    setSubLocations([]);
  };

  const handleSubLocationChange = (e) => {
    setSubLocation(e.target.value);
    if (location && e.target.value) {
      fetchSubLocations(e.target.value);
    } else {
      setSubLocations([]);
    }
  };

  const fetchSubLocations = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/locations/detail`, {
        params: {
          location,
          subLocation: query,
        },
      });

      const locations = response.data.locations
        ? [response.data.locations]
        : [];
      setSubLocations(locations.map((loc) => loc.address_b_name));
    } catch (error) {
      console.error("Error fetching subLocations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubLocation = (subLoc) => {
    setSubLocation(subLoc);
    setSubLocations([]);
  };

  const addFavorite = (location, subLocation) => {
    const newFavorite = {
      id: Date.now(),
      address_a_name: location,
      address_b_name: subLocation,
    };

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyAdded = storedFavorites.some(
      (fav) =>
        fav.address_a_name === location && fav.address_b_name === subLocation
    );

    if (isAlreadyAdded) {
      alert("이미 추가한 지역입니다");
      return;
    }

    const updatedFavorites = [...storedFavorites, newFavorite];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    alert(`${subLocation}이(가) 추가되었습니다`);
    navigate("/my");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && location && subLocation) {
      addFavorite(location, subLocation);
    }
  };

  const handleButtonClick = () => {
    if (location && subLocation) {
      addFavorite(location, subLocation);
    }
  };

  return (
    <div id="search-city-container" className="search-city-container">
      <video
        src={pangVideo}
        type="video/mp4"
        autoPlay
        loop
        muted
        id="video-background"
      ></video>
      <div className="search-city-content">
        <h2 className="search-city-title">관심지역 추가하기</h2>

        <div className="search-city-inputs">
          <div className="dropdown-container">
            <select
              id="location"
              value={location}
              onChange={handleLocationChange}
            >
              <option value="">지역 선택</option>
              {locationsList.map((loc, index) => (
                <option key={index} value={loc} className="option">
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="search-input-container">
            <input
              id="subLocation"
              type="text"
              value={subLocation}
              onChange={handleSubLocationChange}
              onKeyDown={handleKeyDown}
              placeholder="시군구를 입력해주세요"
            />
            {loading && <p>Loading...</p>}
            {subLocations.length > 0 && (
              <ul className="sub-location-list">
                {subLocations.map((subLoc, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSubLocation(subLoc)}
                    style={{ cursor: "pointer" }}
                  >
                    {subLoc}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handleButtonClick} className="search-city-button">
            추가하기
          </button>
        </div>
      </div>
      <div className="mascot">
        <img src={pang} alt="pang" />
      </div>
    </div>
  );
};

export default Search;
