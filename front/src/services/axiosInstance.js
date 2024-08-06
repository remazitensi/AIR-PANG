// import axios from "axios";

// // Axios 인스턴스 생성
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // 쿠키를 포함하여 요청을 보내기 위해 설정
// });

// // 요청 인터셉터 설정 (특별한 처리가 필요 없으면 제거 가능)
// axiosInstance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// // 응답 인터셉터 설정
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;
// 삭제 해도 무방