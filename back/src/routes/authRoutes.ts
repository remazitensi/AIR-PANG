import { Router } from 'express';
import { googleCallback, refreshAccessToken } from '@_controllers/authController'; // 절대 경로로 변경

const router = Router();

router.post('/google/callback', googleCallback);
router.post('/refresh', refreshAccessToken);

export default router;
