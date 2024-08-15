import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallback, refreshToken } from '@_controllers/authController';

const router = Router();

// Google 로그인 콜백
router.get('/google/callback', passport.authenticate('google', { session: true }), googleAuthCallback);

// 리프레시 토큰을 이용한 액세스 토큰 갱신
router.post('/refresh-token', refreshToken);

export default router;
