import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SearchCity.css";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      fetchResults();
    } else {
      setSearchData([]);
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/locations/detail",
        {
          params: {
            location: query.split(" ")[0],
            subLocation: query.split(" ")[1] || "",
          },
        }
      );

      console.log("Response data from results endpoint:", response.data);

      const locations = response.data.locations
        ? [response.data.locations]
        : [];
      setSearchData(locations);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchResults();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(searchData.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null ? searchData.length - 1 : Math.max(0, prevIndex - 1)
      );
    } else if (e.key === "Enter" && selectedIndex !== null) {
      handleSelect(searchData[selectedIndex]);
    }
  };

  const handleSelect = (location) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some((fav) => fav.id === location.id)) {
      favorites.push(location);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    navigate("/my");
  };

  return (
    <>
      <h2>관심지역 설정하기</h2>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="국내 도시를 검색해 보세요."
        />
        <button onClick={handleSearch}>찾기</button>
        {searchData.length > 0 && (
          <ul className="results-list">
            {searchData.map((location, index) => (
              <li
                key={location.id}
                onClick={() => handleSelect(location)}
                className={index === selectedIndex ? "highlighted" : ""}
              >
                {location.address_a_name} {location.address_b_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchComponent;
