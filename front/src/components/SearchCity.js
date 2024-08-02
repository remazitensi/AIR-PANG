import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchCity.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    filterResults();
  }, [query]);

  const filterResults = () => {
    // JSON 파일이나 API에서 데이터 로드하기
    const districtsData = [];

    const filteredResults = districtsData
      .filter((district) => {
        const queryParts = query
          .split(" ")
          .map((part) => part.trim())
          .filter((part) => part);
        const addressMatch = queryParts.every(
          (part) =>
            district.locations.address_a_name.includes(part) ||
            district.locations.address_b_name.includes(part)
        );
        return addressMatch;
      })
      .sort((a, b) =>
        a.locations.address_b_name.localeCompare(b.locations.address_b_name)
      )
      .slice(0, 10);
    setResults(filteredResults);
    setSelectedIndex(null); // 결과가 변경시 인덱스 초기화
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    filterResults(); // 찾기 버튼 누르면 필터 해주기
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(results.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? results.length - 1 : Math.max(0, prevIndex - 1)
      );
    } else if (e.key === "Enter" && selectedIndex !== null) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = async (district) => {
    try {
      // API 호출
      const response = await fetch(
        `http://localhost:8080/location/detail?location=${district.locations.address_a_name}&subLocation=${district.locations.address_b_name}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location details");
      }

      const data = await response.json();

      // 즐겨찾기추가 API 호출
      const addFavoriteResponse = await fetch(
        "http://localhost:8080/my/locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address_a_name: district.locations.address_a_name,
            address_b_name: district.locations.address_b_name,
          }),
        }
      );

      if (!addFavoriteResponse.ok) {
        throw new Error("Failed to add favorite");
      }

      // 추가되면 나의 페이지 이동
      navigate("/my");
    } catch (error) {
      console.error("Error handling select:", error);
    }
  };

  return (
    <>
      <h1>관심지역 설정</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="국내 도시를 검색해 보세요."
        />
        <button onClick={handleSearch}>찾기</button>
        {results.length > 0 && (
          <ul className="results-list">
            {results.map((district, index) => (
              <li
                key={district.locations.id}
                onClick={() => handleSelect(district)}
                className={index === selectedIndex ? "highlighted" : ""}
              >
                {district.locations.address_a_name}{" "}
                {district.locations.address_b_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;
