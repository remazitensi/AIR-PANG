import express from 'express';
import cors from 'cors';  // CORS 추가 프론트와의 연결을 위함
import session from 'express-session';
import cookieParser from 'cookie-parser';
import routes from '@_routes/index'; // 라우터 가져오기
import startCronJob from '@_scripts/updateData'; // Cron job 스크립트 가져오기
import 'tsconfig-paths/register';
import '@_config/env.config';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
}));

// 라우트 설정
app.use(routes);

// 서버 시작 시 데이터 업데이트 및 크론 작업 시작
startCronJob();

export default app;