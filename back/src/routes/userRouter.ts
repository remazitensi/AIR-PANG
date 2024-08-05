import { Router } from 'express';
import { getUserInfo } from '@_controllers/userController';
import { authenticateJWT } from '@_middlewares/authMiddleware';
import { logout, deleteUser } from '@_controllers/authController';

const userRouter = Router();

userRouter.get('/', authenticateJWT, getUserInfo); //유저정보
userRouter.post('/logout', authenticateJWT, logout); //로그아웃
userRouter.delete('/', authenticateJWT, deleteUser); //탈퇴

export default userRouter;
