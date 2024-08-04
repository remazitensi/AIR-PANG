import dotenv from 'dotenv';
import { Config } from '@_types/config';

dotenv.config();

export const config: Config = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '', 
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '', 
};
