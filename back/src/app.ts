import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import { authenticateJWT } from '@_middlewares/authMiddleware'; // JWT 인증 미들웨어 가져오기
import routes from '@_routes/index'; // 라우트 가져오기
import startCronJob from '@_scripts/updateData'; // Cron job 가져오기
import dotenv from 'dotenv';
// import passport from 'passport';
import '@_config/passport.config'; 
// import { authenticateJWT } from '@_middlewares/authMiddleware'; 
// import routes from '@_routes/index'; 
// import startCronJob from '@_scripts/updateData'; 
// import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController'; 

// 환경 변수 설정
dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));

// JSON 바디 파서와 쿠키 파서 설정
app.use(express.json());
app.use(cookieParser());

// JWT 인증 미들웨어를 원하는 라우트에 적용
app.use('/', routes); // 모든 /api 경로에 JWT 인증 미들웨어 적용

startCronJob();

// 에러 핸들러 미들웨어 (필요에 따라 추가)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
