import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/My.css";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
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
            <li>즐겨찾기 항목이 없습니다.</li>
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
