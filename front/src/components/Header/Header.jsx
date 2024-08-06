import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 환경 변수에서 클라이언트 ID 가져오기
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const responseType = "code"; // 인증 코드를 사용
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.profile"
  );
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/'); // 로그아웃 후 '/' 경로로 이동
  };

  return (
    <header className="header">
      <div className="logo">
        <Link
          to="/"
          style={{
            marginLeft: "20px",
            textDecoration: "none",
            fontSize: "28px",
            fontWeight: "200",
          }}
        >
          공기팡
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/locations">우리동네 찾아보기</Link>
          </li>
          {!isLoggedIn ? (
            <li>
              <Link to={authUrl}>로그인</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/challenges">환경챌린지</Link>
              </li>
              <li>
                <Link to="/my">마이페이지</Link>
              </li>
              <li>
                <button onClick={handleLogoutClick}>로그아웃</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
