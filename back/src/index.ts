import app from './app';

const port = process.env.PORT || 8080; // 기본값 설정

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
