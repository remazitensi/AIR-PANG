import React from 'react';

function MainPage() {
  return (
    <div>
      <h1>오늘 날씨어때요?</h1>
      <p>여기가 메인 페이지입니다.</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>재영님의 로그인 컴포넌트</div>
        <div style={{ flex: 1, textAlign: 'center' }}>민정님의 날씨위젯 컴포넌트</div>
      </div>
    </div>
  );
}

export default MainPage;
