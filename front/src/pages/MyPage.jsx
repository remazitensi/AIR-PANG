import React from "react";
import My from "../components/My";
import ChallengeStatus from "../components/Challenges/ChallengeStatus";
import "../styles/MyPage.css";

function MyPage() {
  return (
    <div className="my-page-container">
      <div className="my-page-title">
        <h2>마이페이지</h2>
      </div>
      <div className="my-page-content">
        <My />
        <ChallengeStatus />
      </div>
    </div>
  );
}

export default MyPage;
