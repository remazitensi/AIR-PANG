import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // 서버에서 쿠키를 설정한 후 클라이언트에서 직접 쿠키를 다루지 않음
        // 서버에서 로그인 상태를 업데이트
        onLogin();
        navigate("/");
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    fetchToken();
  }, [navigate, onLogin]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
