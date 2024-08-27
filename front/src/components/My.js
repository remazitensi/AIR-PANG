import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/My.css";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    if (storedFavorites.length > 0) {
      // 첫 번째 관심지역을 WeatherLanding에서 기본값으로 사용하도록 저장
      localStorage.setItem(
        "defaultLocation",
        JSON.stringify(storedFavorites[0])
      );
    } else {
      // 즐겨찾기 항목이 없을 경우 기본값으로 서울 강남구를 설정
      localStorage.setItem(
        "defaultLocation",
        JSON.stringify({
          id: 1,
          address_a_name: "서울",
          address_b_name: "강남구",
        })
      );
    }
  }, []);

  const handleViewWeather = (location) => {
    navigate("/weather", {
      state: {
        locationName: location.address_a_name,
        subLocationName: location.address_b_name,
      },
    });
  };

  const handleDelete = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    if (updatedFavorites.length === 0) {
      // 즐겨찾기 항목이 모두 삭제되면 서울 강남구를 기본값으로 설정
      localStorage.setItem(
        "defaultLocation",
        JSON.stringify({
          id: 1,
          address_a_name: "서울",
          address_b_name: "강남구",
        })
      );
    } else {
      // 첫 번째 관심지역을 WeatherLanding에서 기본값으로 사용하도록 저장
      localStorage.setItem(
        "defaultLocation",
        JSON.stringify(updatedFavorites[0])
      );
    }
  };

  return (
    <div className="my-favorite-container">
      <div className="my-favorite">
        <h3>나의 관심지역</h3>
        <ul>
          {favorites.length > 0 ? (
            favorites.map((location) => (
              <li key={location.id} className="favorite-item">
                <span
                  className="location-name"
                  onClick={() => handleViewWeather(location)}
                >
                  {location.address_a_name} {location.address_b_name}
                </span>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(location.id)}
                >
                  X
                </button>
              </li>
            ))
          ) : (
            <li className="favorite-empty">즐겨찾기 항목이 없습니다.</li>
          )}
        </ul>
        <a href="/search" className="addFavorite">
          관심지역 설정하기
        </a>
      </div>
    </div>
  );
};

export default MyPage;
