import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import MainPage from "./pages/MainPage";
import UriLocations from "./pages/UriLocations";
import Challenges from "./pages/Challenges";
import SearchCityPage from "./pages/SearchCityPage";
import MyPage from "./pages/MyPage";
import Weather from "./pages/Weather";
import WeatherPage from "./pages/WeatherPage";
import Cursor from "./components/Cursor";
import BubbleCursor from "./components/BubbleCursor";
import GoogleCallback from "./components/Landing/GoogleCallback";
import LocationPage from "./components/Location/LocationPage";
import LocationDetail from "./components/Location/LocationDetail";
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogin = () => {
    console.log('얍얍 여러분 화이팅!!') //코치님의 응원메세지 출력
    setIsLoggedIn(true);
  };

  const handleLogout = () => {

    fetch(`${apiUrl}/my/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        console.log("성공!");
        setIsLoggedIn(false);
      })
      .catch(() => {
        console.log("실패!");
      });
  };

  return (
    <Router>
      <Cursor />
      <BubbleCursor />
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} />} />
          <Route path="/locations" element={<UriLocations />} />
          <Route path="/locations/sub" element={<LocationPage />} />
          <Route path="/locations/detail" element={<LocationDetail />} />

          <>
            <Route path="/detail" element={<Weather />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/challenges/*" element={<Challenges />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/search" element={<SearchCityPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback onLogin={handleLogin} />} />
          </>
          {/* )} */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
