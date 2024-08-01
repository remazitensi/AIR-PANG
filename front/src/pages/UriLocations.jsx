import React from "react";
import MapChart from "../components/Map/MapChart";
import LocationDetail from "../components/Location/LocationDetail";
import LocationPage from "../components/Location/LocationPage";
import Locations from "../components/Location/Locations";

function UriLocations() {
  return (
    <div>
      <h1>우리동네 찾아보기</h1>
      <p>여기가 우리동네 찾아보기 페이지입니다.</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapChart />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <LocationDetail /> */}
        {/* <Locations /> */}
        {/* <LocationPage /> */}
      </div>
    </div>
  );
}

export default UriLocations;
