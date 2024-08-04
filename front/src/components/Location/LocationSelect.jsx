// src/LocationSelect.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LocationSelect() {
  const [locations, setLocations] = useState([]);
  const [selectedMajorRegion, setSelectedMajorRegion] = useState("");
  const [selectedSubRegion, setSelectedSubRegion] = useState("");

  useEffect(() => {
    // axios를 사용하여 데이터 가져오기
    axios.get('http://localhost:8080/locations')
      .then(response => {
        setLocations(response.data.locations);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMajorRegionChange = (event) => {
    setSelectedMajorRegion(event.target.value);
    setSelectedSubRegion(""); // 주요 지역이 변경될 때 세부 지역 초기화
  };

  const handleSubRegionChange = (event) => {
    setSelectedSubRegion(event.target.value);
  };

  // 주요 지역 목록 생성
  const majorRegions = [...new Set(locations.map(location => location.address_a_name))];

  // 선택된 주요 지역에 따른 세부 지역 목록 생성
  const subRegions = locations
    .filter(location => location.address_a_name === selectedMajorRegion)
    .map(location => location.address_b_name);

  return (
    <div>
      <h1>지역 선택기</h1>
      <div>
        <label>주요 지역: </label>
        <select value={selectedMajorRegion} onChange={handleMajorRegionChange}>
          <option value="">선택하세요</option>
          {majorRegions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {selectedMajorRegion && (
        <div>
          <label>세부 지역: </label>
          <select value={selectedSubRegion} onChange={handleSubRegionChange}>
            <option value="">선택하세요</option>
            {subRegions.map((subRegion) => (
              <option key={subRegion} value={subRegion}>{subRegion}</option>
            ))}
          </select>
        </div>
      )}

      {selectedMajorRegion && selectedSubRegion && (
        <div>
          <h2>선택된 지역</h2>
          <p>주요 지역: {selectedMajorRegion}</p>
          <p>세부 지역: {selectedSubRegion}</p>
        </div>
      )}
    </div>
  );
}

export default LocationSelect;
