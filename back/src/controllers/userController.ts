import { Request, Response } from 'express';
import { UserService } from '@_services/userService';

// UserService 인스턴스 생성
const userService = new UserService();

// 사용자 마이페이지 정보 및 참여중인 환경 챌린지 목록 조회
export const getUserInfo = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  const userId = req.user.id;

  try {
    console.log(`Fetching profile and challenges for user ID: ${userId}`);
    const { challenges } = await userService.getUserProfileAndChallenges(userId);
    res.json({ challenges });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
