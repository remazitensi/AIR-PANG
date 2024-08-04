import { Router } from 'express';
import { getUserInfo, updateUser } from '@_controllers/userController';
import { authenticateJWT } from '@_middlewares/authMiddleware';
import { logout, deleteUser } from '@_controllers/authController';

const userRouter = Router();

userRouter.get('/', authenticateJWT, getUserInfo);
userRouter.put('/', authenticateJWT, updateUser);
userRouter.post('/logout', authenticateJWT, logout);
userRouter.delete('/', authenticateJWT, deleteUser);

export default userRouter;
