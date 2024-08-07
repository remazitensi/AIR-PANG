import React from "react";
import MapChart from "../components/Map/MapChart";

function UriLocations() {
  return (
    <div
      style={{
        textAlign: 'center'
      }}
    >
      <h1>우리동네 찾아보기</h1>
      <p>지도에서 원하시는 지역을 클릭해주세요!</p>
      <div>
        <MapChart />
      </div>
    </div>
  );
}

export default UriLocations;
