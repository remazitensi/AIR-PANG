export interface Config {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  JWT_SECRET: string; 
  JWT_REFRESH_SECRET: string;
  SECURE_COOKIES: boolean;
  PORT?: number;
  CLIENT_URL?: string;
  SESSION_SECRET?: string;
}
