import React from "react";
// import AqiTable from "./AqiTable";
import "../../styles/Message.css";

const Message = () => {
  return (
    <div className="message-card">
      <h2>대기질 지수 (AQI)</h2>
      <p>대기질 지수(AQI)는 대기 오염 수준을 평가하는 지표입니다.</p>
      <p>
        우리 서비스에서는 지역별 2023년 대기 오염물질 데이터와 실시간 대기
        오염물질 데이터를 기반으로 총 두 개의 AQI를 산출합니다.
      </p>
      {/* AqiTable 컴포넌트 위치에 따라 이동 가능 */}
      {/* <h3>AQI 등급표</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AqiTable />  
      </div> */}
      <p>등급은 실시간 최대 AQI를 기반으로 계산합니다.</p>
      <p>
        점수는 연간 최대 AQI와 실시간 최대 AQI의 차이를 기준으로 계산합니다.
      </p>
      <p>기본 점수는 50점이며, 차이가 클수록 점수가 감소하거나 증가합니다.</p>
      <p>
        동일할 경우 50점을 부여하고, 연간 최대 AQI보다 실시간 AQI가 낮으면
        점수가 증가하며, 높으면 점수가 감소합니다.
      </p>
      <p>이를 통해 최대 100점까지 부여되며, 0점 이하로 내려가지 않습니다.</p>
    </div>
  );
};

export default Message;
