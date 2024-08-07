import React from "react";
// import "../../styles/AqiTable.css";

export default function AqiTable() {
  return (
    <div className="aqi-table-container">
      <table className="aqi-table">
        <thead>
          <tr>
            <th>AQI</th>
            <th>지수구분</th>
            <th>구간의미</th>
          </tr>
        </thead>
        <tbody>
          <tr className="good">
            <td>0-50</td>
            <td>좋음</td>
            <td>대기오염 관련 질환자군에서도 영향이 유발되지 않을 수준</td>
          </tr>
          <tr className="moderate">
            <td>51-100</td>
            <td>보통</td>
            <td>환자군에게 만성 노출시 경미한 영향이 유발될 수 있는 수준</td>
          </tr>
          <tr className="sensitive">
            <td>101-150</td>
            <td>민감군영향</td>
            <td>환자군 및 민감군에게 유해한 영향이 유발될 수 있는 수준</td>
          </tr>
          <tr className="unhealthy">
            <td>151-200</td>
            <td>나쁨</td>
            <td>
              환자군 및 민감군(어린이, 노약자 등)에게 유해한 영향 유발, 일반일도
              건강상 불쾌감을 경험할 수 있는 수준
            </td>
          </tr>
          <tr className="very-unhealthy">
            <td>201-300</td>
            <td>매우나쁨</td>
            <td>
              환자군 및 민감군에게 급성 노출시 심각한 영향 유발, 일반인도 악한
              영향이 유발 될 수 있는 수준
            </td>
          </tr>
          <tr className="hazardous">
            <td>300+</td>
            <td>위험</td>
            <td>
              환자군 및 민감군에게 응급 조치가 발생되거나, 일반인에게 유해한
              영향이 유발될 수 있는 수준
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}