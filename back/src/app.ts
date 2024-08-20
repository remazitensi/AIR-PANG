import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import routes from '@_routes/index';
import { UpdateDataCron } from '@_controllers/updateDataCron';
import '@_config/passport.config';
import { CustomError } from '@_utils/customError';
import logger from '@_utils/logger';

dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 인증된 API 라우트
app.use('/api', routes);

// 크론 작업 시작
const updateDataCron = new UpdateDataCron();
updateDataCron.startCronJob();

// 확장된 에러 핸들러 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  
  const { statusCode, message, validationErrors } = CustomError.handleError(err);

  // 에러 수준에 맞게 경로와 함께 로깅
  logger[statusCode >= 500 ? 'error' : 'warn'](`Error: ${message} - Status: ${statusCode}`, {
    error: err,
    path: req.path,
  });

  // 클라이언트에 최종 응답
  res.status(statusCode).json({
    status: statusCode,
    message: message,
    ...(validationErrors && { errors: validationErrors }), // 클라이언트 측에서 수정할 수 있는 유효성 검사 오류만 객체로 전달
  });
});

export default app;
