import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeStatus from './Challenges/ChallengeStatus';
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
    <div>
      <h2>마이페이지</h2>
      <div className="my-favorite">
        <ul>
          {favorites.length > 0 ? (
            favorites.map((location) => (
              <li key={location.id}>
                {location.address_a_name} {location.address_b_name}
                <button
                  className="delete-button"
                  onClick={() => handleViewWeather(location)}
                >
                  보기
                </button>
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
      <ChallengeStatus />
      </div>
  );
};

export default MyPage;
