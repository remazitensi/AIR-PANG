import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import LocationPage from './components/Location/LocationPage';
import Locations from './components/Location/Locations';
import LocationDetail from './components/Location/LocationDetail';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/locations">우리동네 찾기</Link>
        </nav>
        <h1>Welcome back!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/sub" element={<LocationPage />} />
          <Route path="/location/detail" element={<LocationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
