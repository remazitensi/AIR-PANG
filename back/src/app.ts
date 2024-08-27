import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { config } from '@_config/env.config'; // config 모듈 가져오기
import passport from 'passport';
import routes from '@_routes/index';
import { UpdateDataCron } from '@_controllers/updateDataCron';
import '@_config/passport.config';
import { CustomError } from '@_utils/customError';
import logger from '@_utils/logger';

// Express 앱 생성
const app = express();

// CORS 설정
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 세션 설정
app.use(session({
  secret: config.SESSION_SECRET || '', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.SECURE_COOKIES, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());


app.use('/api', routes);


const updateDataCron = new UpdateDataCron();
updateDataCron.startCronJob();


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message, validationErrors } = CustomError.handleError(err);

  logger[statusCode >= 500 ? 'error' : 'warn'](`Error: ${message} - Status: ${statusCode}`, {
    error: err,
    path: req.path,
  });

 
  res.status(statusCode).json({
    status: statusCode,
    message: message,
    ...(validationErrors && { errors: validationErrors }), // 클라이언트 측에서 수정할 수 있는 유효성 검사 오류만 객체로 전달
  });
});

export default app;
