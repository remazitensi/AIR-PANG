import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      sub: string;
      name: string;
      email: string;
      picture: string;
      refreshToken?: string;
    };
  }
}
