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

dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

//세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === '', 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000, 
  }
}));


// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 기본적인 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

// 인증된 API 라우트
app.use('/api', routes);

// 크론 작업 시작
const updateDataCron = new UpdateDataCron();
updateDataCron.startCronJob();

// 에러 핸들러 미들웨어
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke!');
});

export default app;
