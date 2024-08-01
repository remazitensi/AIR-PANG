import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // 쿠키를 포함하여 요청을 보내기 위해 설정
});

// 요청 인터셉터 설정 (쿠키는 자동으로 전송되므로 설정 불필요)
axiosInstance.interceptors.request.use(
  config => {
    // 쿠키는 자동으로 포함되므로 추가 작업 불필요
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
    return Promise.reject(error);
  }
);

export default axiosInstance;
