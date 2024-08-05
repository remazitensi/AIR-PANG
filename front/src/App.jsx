import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import MainPage from "./pages/MainPage";
import UriLocations from "./pages/UriLocations";
import Challenges from "./pages/Challenges";
import SearchCityPage from "./pages/SearchCityPage";
import MyPage from "./pages/MyPage";
import WeatherPage from "./pages/WeatherPage";
import Cursor from "./components/Cursor";
import BubbleCursor from "./components/BubbleCursor";
import GoogleCallback from "./components/Landing/GoogleCallback";
import LocationPage from "./components/Location/LocationPage";
import LocationDetail from "./components/Location/LocationDetail";

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
          <Route path="/" element={<MainPage />} />
          <Route path="/locations" element={<UriLocations />} />
          <Route path="/locations/sub" element={<LocationPage />} />
          <Route path="/location/detail" element={<LocationDetail />} />

          <>
            <Route path="/detail" element={<WeatherPage />} />
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
