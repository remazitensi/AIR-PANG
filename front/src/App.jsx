import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import MainPage from './pages/MainPage';
import UriLocations from './pages/UriLocations';
import Challenges from './pages/Challenges';
import MyPage from './pages/MyPage';
import Weather from './pages/Weather';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/locations" element={<UriLocations />} />
          {/* {isLoggedIn && ( */}
            <>
              <Route path="/weather" element={<Weather />} />
              <Route path="/challenges/*" element={<Challenges />} />
              <Route path="/my" element={<MyPage />} />
            </>
          {/* )} */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
