import React from "react";
import googleLogo from "../../assets/images/google-logo.png"; // 이미지 경로
import "../../styles/GoogleLoginButton.css";

const GoogleLoginButton = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 환경 변수에서 클라이언트 ID 가져오기
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const responseType = "code"; // 인증 코드를 사용
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.profile"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  return (
    <a href={authUrl} className="google-login-button">
      <img src={googleLogo} alt="Google Logo" className="google-logo" />
    </a>
  );
};

export default GoogleLoginButton;
