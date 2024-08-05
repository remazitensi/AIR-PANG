import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>지역 찾기</h1>
      <Link to="/locations">
        <button>지역 찾기</button>
      </Link>
    </div>
  );
}

export default Home;
