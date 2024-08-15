import { Request, Response } from 'express';
import { UserService } from '@_services/userService';

const userService = new UserService();

// 사용자 마이페이지 정보 및 작성한 챌린지 목록 조회
export const getUserInfo = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  const userId = req.user.id;

  try {
    const { challenges } = await userService.getUserProfileAndChallenges(userId);
    res.json({ challenges });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.clearCookie('refreshToken');
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    res.status(200).json({ message: '로그아웃 성공' });
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.id;

  try {
    await userService.deleteUser(userId);
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '계정 탈퇴 완료' });
  } catch (deleteError) {
    console.error('Error deleting user:', deleteError);
    res.status(500).json({ message: '계정 탈퇴 실패' });
  }
};
