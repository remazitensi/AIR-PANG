import { Router } from 'express';
import locationRouter from '@_routes/locationRouter';
import challengeRouter from '@_routes/challengeRouter';
import taskRouter from '@_routes/taskRouter';

const router = Router();

router.use('/locations', locationRouter);
router.use('/challenges', challengeRouter);
router.use('/tasks', taskRouter);

export default router;
