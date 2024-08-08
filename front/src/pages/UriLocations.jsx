import React from "react";
import MapChart from "../components/Map/MapChart";
import "../styles/UriLocations.css";
import pang from "../assets/images/pang.png"; // 새 스타일 파일을 import

function UriLocations() {
  return (
    <div className="UriLocations">
      <div className="uri-locations-top">
        <h1 className="uri-locations-title">우리동네 찾아보기</h1>
        <p className="uri-locations-subtitle">
          지도에서 원하시는 지역을 클릭해주세요!
        </p>
      </div>
      <div className="uri-map-container">
        <MapChart />
      </div>
      <div className="pang-on-location">
        <img src={pang} alt="pang" />
      </div>
    </div>
  );
}

export default UriLocations;
