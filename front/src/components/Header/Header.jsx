import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import pangLogo from "../../assets/images/pangLogo.png";

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
    alert("로그아웃 되었습니다."); // 알림 표시
    navigate("/"); // 로그아웃 후 '/' 경로로 이동
  };

  const handleChallengeClick = (event) => {
    if (!isLoggedIn) {
      event.preventDefault(); // 클릭 시 페이지 이동 방지
      alert("로그인 후 환경챌린지를 이용하실 수 있습니다."); // 알림 표시
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={pangLogo} alt="Logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul className="nav-menu-items">
          <li>
            <Link to="/locations">우리동네 찾아보기</Link>
          </li>
          <li>
            <Link
              to={isLoggedIn ? "/challenges" : "#"}
              onClick={handleChallengeClick}
            >
              환경챌린지
            </Link>
          </li>
          {!isLoggedIn ? (
            <li>
              <Link
                to={authUrl}
                className="login-menu-item"
                style={{ color: "#fff" }}
              >
                로그인
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/my">마이페이지</Link>
              </li>
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="logout-menu-item"
                >
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
