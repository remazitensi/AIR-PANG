import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'; // CSS 파일을 import 합니다

function Header({ isLoggedIn, onLogout }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="Logo" /> 
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/locations">우리동네 찾아보기</Link></li>
          {!isLoggedIn ? (
            <li><Link to="/login">로그인</Link></li>
          ) : (
            <>
              <li><Link to="/weather">날씨정보</Link></li>
              <li><Link to="/challenges/* ">환경챌린지 페이지</Link></li>
              <li><Link to="/my">마이페이지</Link></li>
              <li><button onClick={onLogout}>로그아웃</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;