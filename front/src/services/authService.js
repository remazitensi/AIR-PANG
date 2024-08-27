// import axiosInstance from "./axiosInstance";

// // 로그아웃 요청
// export const logout = async () => {
//   try {
//     await axiosInstance.post("/logout"); // 서버에 로그아웃 요청
//     localStorage.removeItem("jwt"); // 클라이언트에서 JWT 삭제
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

// // 탈퇴 요청
// export const deleteAccount = async (userId) => {
//   try {
//     await axiosInstance.post("/delete", { userId }); // 서버에 탈퇴 요청
//     localStorage.removeItem("jwt"); // 클라이언트에서 JWT 삭제
//   } catch (error) {
//     console.error("Account deletion error:", error);
//   }
// };
// 삭제 해도 무방