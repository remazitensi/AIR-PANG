import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import routes from '@_routes/index';
import startCronJob from '@_scripts/updateData';
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

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // 개발 환경에서는 secure: false
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 기본적인 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  // console.log('Cookies:', req.cookies);
  // console.log(`Request URL: ${req.url}`);
  // console.log(`Request Method: ${req.method}`);
  next();
});


// 인증된 API 라우트
app.use('/', routes);

startCronJob();

// 에러 핸들러 미들웨어
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke!');
});

export default app;
