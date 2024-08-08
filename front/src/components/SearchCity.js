import React, { useState } from "react";
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
  const [alertDisplayed, setAlertDisplayed] = useState(false); // 플래그 상태 추가
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setSubLocation("");
  };

  const handleSubLocationChange = (e) => {
    setSubLocation(e.target.value);
  };

  const fetchSubLocationValidation = async (location, subLocation) => {
    try {
      const response = await axios.get(`${apiUrl}/locations/detail`, {
        params: { location, subLocation },
      });

      // 데이터 유효성 검사 - 인풋값 잘못들어오면 알려주기 위한 세팅.
      return (
        response.data &&
        response.data.locations &&
        response.data.locations.address_b_name
      );
    } catch (error) {
      console.error("Error fetching subLocations:", error);
      return false;
    }
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

  const handleValidationAndAdd = async () => {
    if (location && subLocation) {
      if (!alertDisplayed) {
        const isValid = await fetchSubLocationValidation(location, subLocation);
        if (isValid) {
          addFavorite(location, subLocation);
        } else {
          alert(
            "지역명이 올바르지 않습니다. 양식에 맞게 입력해주세요.\n 예시) 강릉❌ 강릉시⭕️ // 옥천❌ 옥천군⭕️ // 강남❌ 강남구⭕️"
          );
          setAlertDisplayed(true); // 플래그 알림기록
        }
      }
    } else {
      if (!alertDisplayed) {
        alert("지역과 세부지역을 입력해주세요");
        setAlertDisplayed(true); // 플래그 알림기록
      }
    }

    // 플래그 초기화 시켜서 여러번 안뜨게.
    setTimeout(() => setAlertDisplayed(false), 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleValidationAndAdd();
    }
  };

  const handleButtonClick = () => {
    handleValidationAndAdd();
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
          </div>
          <button onClick={handleButtonClick} className="search-city-button">
            추가하기
          </button>
        </div>
      </div>
      {/* <div className="mascot">
        <img src={pang} alt="pang" />
      </div> */}
    </div>
  );
};

export default Search;
