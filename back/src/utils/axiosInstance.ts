// src/utils/axiosInstance.ts
import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://oauth2.googleapis.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  config => {
    // 필요 시 여기에서 요청을 수정합니다. 예: 공통 헤더 추가
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 에러 처리 로직 추가
    return Promise.reject(error);
  }
);

export default axiosInstance;
