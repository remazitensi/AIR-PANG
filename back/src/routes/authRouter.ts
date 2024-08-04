import { Router } from 'express';
import { googleAuth, googleAuthCallback, refreshToken } from '@_controllers/authController';

const router = Router();

// Google 로그인 라우트
router.get('/google', googleAuth);

// Google 로그인 콜백 라우트
router.get('/google/callback', googleAuthCallback);

// 리프레시 토큰을 이용한 엑세스 토큰 갱신
router.post('/refresh-token', refreshToken);


export default router;
