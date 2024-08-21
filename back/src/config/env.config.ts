import dotenv from 'dotenv';
import { Config } from '@_types/config';

// 환경에 따라 다른 .env 파일 로드
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// 환경 변수 로드 및 설정
export const config: Config = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  SECURE_COOKIES: process.env.NODE_ENV === 'production', // production일 경우 true
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080, // 기본 포트 8080
  CLIENT_URL: process.env.CLIENT_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET, 
};
