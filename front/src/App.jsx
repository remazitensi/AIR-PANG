import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import MainPage from "./pages/MainPage";
import UriLocations from "./pages/UriLocations";
import Challenges from "./pages/Challenges";
import SearchCityPage from "./pages/SearchCityPage";
import MyPage from "./pages/MyPage";
import Weather from "./pages/Weather";
import LocationPage from './components/Location/LocationPage';
// import Locations from './components/Location/Locations';
import LocationDetail from './components/Location/LocationDetail';
import Cursor from "./components/Cursor";
import BubbleCursor from "./components/BubbleCursor";
import GoogleCallback from "./components/Login/googlecallback";
import WeatherLanding from "./components/Landing/WeatherLanding";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Cursor />
      <BubbleCursor />
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<WeatherLanding />} />
          <Route path="/locations" element={<UriLocations />} />
          <Route path="/locations/sub" element={<LocationPage />} />
          <Route path="/location/detail" element={<LocationDetail />} />
          <>
            <Route path="/detail" element={<Weather />} />
            <Route path="/challenges/*" element={<Challenges />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/search" element={<SearchCityPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
          </>
          {/* )} */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
