import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from '@_config/env.config';
import { AuthRepository } from '@_repositories/authRepository';
import { AuthService } from '@_services/authService';
import { User } from '@_types/user';
import logger from '@_utils/logger';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

// GoogleStrategy 설정
passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: config.REDIRECT_URI,
  passReqToCallback: true,
}, async (
  req: Express.Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  try {
    const googleId = profile.id;
    const name = profile.displayName || '';

    // 사용자 조회
    const existingUser = await authService.findUser(googleId);

    // 사용자가 없으면 새로 생성
    const user = existingUser ?? await authService.createUser({
      googleId,
      name,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    });

    done(null, user);
  } catch (error) {
    logger.error('Error during Google authentication:', error);
    done(error);
  }
}));

passport.serializeUser((user: User, done) => {
  done(null, user?.id || null);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await authService.findUserById(id);
    done(null, user || null);
  } catch (error) {
    logger.error('Error deserializing user:', error);
    done(error);
  }
});
