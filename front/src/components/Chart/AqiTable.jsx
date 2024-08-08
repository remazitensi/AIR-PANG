// AqiTable.js
import React from "react";
import "../../styles/AqiTable.css";

const AqiTable = () => {
  return (
    <div className="aqi-table-container">
      <div className="table-intro">
        <h2 className="aqi-table-title">대기질 지수 (AQI)</h2>
        <p className="aqi-table-summary">
          대기질 지수(AQI)는 대기 오염 수준을 평가하는 지표입니다.
          <br />
          우리 서비스에서는 지역별 2023년 대기 오염물질 데이터와 실시간 대기
          오염물질 데이터를 기반으로 총 두 개의 AQI를 산출합니다.
        </p>
      </div>
      <table className="aqi-table">
        <thead>
          <tr>
            <th className="highlight">지수구분</th>
            <th className="good">좋음</th>
            <th className="moderate">보통</th>
            <th className="sensitive">민감군영향</th>
            <th className="unhealthy">나쁨</th>
            <th className="very-unhealthy">매우나쁨</th>
            <th className="hazardous">위험</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="highlight">AQI</td>
            <td className="good">0-50</td>
            <td className="moderate">51-100</td>
            <td className="sensitive">101-150</td>
            <td className="unhealthy">151-200</td>
            <td className="very-unhealthy">201-300</td>
            <td className="hazardous">300+</td>
          </tr>
          <tr>
            <td colSpan="7" className="additional-info">
              <ul>
                <li>등급은 실시간 최대 AQI를 기반으로 계산합니다.</li>
                <li>
                  점수는 연간 최대 AQI와 실시간 최대 AQI의 차이를 기준으로
                  계산합니다.
                </li>
                <li>
                  기본 점수는 50점이며, 차이가 클수록 점수가 감소하거나
                  증가합니다.
                </li>
                <li>
                  동일할 경우 50점을 부여하고, 연간 최대 AQI보다 실시간 AQI가
                  낮으면 점수가 증가하며, 높으면 점수가 감소합니다.
                </li>
                <li>
                  이를 통해 최대 100점까지 부여되며, 0점 이하로 내려가지
                  않습니다.
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AqiTable;
