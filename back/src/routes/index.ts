import { Router } from 'express';
// import authRouter from '@_routes/authRouter';
import userRouter from '@_routes/userRouter';
import userLocationRouter from './userLocationRouter';
import locationRouter from '@_routes/locationRouter';
import challengeRouter from '@_routes/challengeRouter';
import taskRouter from '@_routes/taskRouter';
// import { authenticateJWT } from '@_middlewares/authMiddleware';

const router = Router();

// router.use('/auth', authRouter);
router.use('/my', userRouter);
router.use('/my/locations', userLocationRouter);
router.use('/locations', locationRouter);
// router.use('/challenges', authenticateJWT, challengeRouter); // 인증 필요
// router.use('/tasks', authenticateJWT, taskRouter); // 인증 필요

export default router;