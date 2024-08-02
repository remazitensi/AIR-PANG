import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/My.css";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:8080/my/locations");
        setFavorites(response.data.locations || []);
      } catch (error) {
        console.error("즐겨찾기 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/my/${id}`);

      if (response.status === 204) {
        // No Content 일 때
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== id)
        );
      } else {
        console.error("즐겨찾기 삭제 실패");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error("잘못된 요청");
            break;
          case 500:
            console.error("서버 오류");
            break;
          default:
            console.error("알 수 없는 오류");
        }
      } else {
        console.error("네트워크 오류");
      }
    }
  };

  const handleViewWeather = (address) => {
    navigate(`/weather?location=${encodeURIComponent(address)}`);
  };

  return (
    <div className="my-page">
      <div className="my-favorite">
        <h2>나의 관심지역</h2>
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.id} className="favorite-card">
                <span
                  onClick={() =>
                    handleViewWeather(
                      `${fav.address_a_name} ${fav.address_b_name}`
                    )
                  }
                >
                  {`${fav.address_a_name} ${fav.address_b_name}`}
                </span>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(fav.id)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>관심지역 목록이 비어 있습니다.</p>
          )}
          <a href="/search" className="addFavorite">
            관심지역 추가하기
          </a>
        </div>
      </div>
      <div className="challenge-status">
        <h2>나의 챌린지 현황</h2>
      </div>
    </div>
  );
};

export default MyPage;
