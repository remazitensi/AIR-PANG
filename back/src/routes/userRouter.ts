import express from 'express';
import { getUserInfo, logout, deleteUser } from '@_controllers/userController';

const router = express.Router();

// 사용자 마이페이지 정보 및 작성한 챌린지 목록 조회
router.get('/', getUserInfo);

// 로그아웃
router.post('/logout', logout);

// 계정 탈퇴 (사용자 삭제)
router.delete('/', deleteUser);

export default router;
