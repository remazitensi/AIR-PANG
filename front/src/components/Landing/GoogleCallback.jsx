import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "react-cookies";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          // JWT를 쿠키에 저장
          Cookies.save("jwt", token, { path: "/" });

          // 메인 페이지로 리디렉션
          navigate("/");
        } else {
          // 인증 코드가 없으면 로그인 페이지로 리디렉션
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
