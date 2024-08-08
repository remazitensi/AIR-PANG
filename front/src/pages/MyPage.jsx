import React from "react";
import My from "../components/My";
import ChallengeStatus from "../components/Challenges/ChallengeStatus";
import "../styles/MyPage.css";
import pangVideo from "../assets/videos/pangVideo.mp4";
const apiUrl = process.env.REACT_APP_API_URL;
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();

  const onAccountDeletion = async () => {
    const confirmDeletion = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/my`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        alert("계정 삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div className="my-page-container">
      <video
        src={pangVideo}
        type="video/mp4"
        autoPlay
        loop
        muted
        className="my-page-video"
      ></video>
      <div className="my-page-title">
        <h2>마이페이지</h2>
      </div>
      <div className="my-page-content">
        <My />
        <div className="my-page-content-right">
          <ChallengeStatus />
          <button
            id="deleteAccount"
            onClick={onAccountDeletion}
            className="delete-account-button"
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
