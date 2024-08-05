import React from "react";
import WeatherLanding from "../components/Landing/WeatherLanding";
function MainPage({ isLoggedIn }) {
  return (
    <div>
      <WeatherLanding isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default MainPage;
