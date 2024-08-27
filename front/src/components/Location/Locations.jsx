import React from 'react';
import { Link } from 'react-router-dom';

function Locations() {
  const locations = [
    '서울', '경기', '강원', '광주', '인천', '전남', '전북', '경북', '경남', '세종', '제주', '충북', '충남', '대전', '대구', '부산', '울산'
  ];

  return (
    <div>
      {locations.map(location => (
        <Link key={location} to={`/locations/sub?location=${location}`}>
          <button>{location}</button>
        </Link>
      ))}
    </div>
  );
}

export default Locations;
