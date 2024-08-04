import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';
import { User } from '@_types/user'; // 사용자 정의 User 타입 import

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
  const userService = new UserService();
  try {
    const googleId = profile.id;
    const name = profile.displayName || '';

    // 사용자 생성 또는 검색
    const user = await userService.findOrCreateUser({
      googleId,
      name,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    });

    done(null, user);
  } catch (error) {
    done(error as Error);
  }
}));

// 사용자 세션 직렬화
passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as User; // 사용자 정의 User로 타입 단언
  done(null, typedUser.id);
});

// 사용자 세션 역직렬화
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await new UserService().findUserById(id) as User; // User로 타입 단언
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

export default passport;
