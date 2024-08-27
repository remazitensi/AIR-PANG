import { Request, Response, NextFunction } from 'express';
import { UserService } from '@_services/userService';
import { AuthenticationError } from 'utils/customError';
import logger from '@_utils/logger'; 

const userService = new UserService();

// 사용자 마이페이지 정보 및 작성한 챌린지 목록 조회
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    logger.error('Invalid user data:', { user: req.user });
    return next(new AuthenticationError('Invalid user data'));
  }

  const userId = req.user.id;

  try {
    const { challenges } = await userService.getUserProfileAndChallenges(userId);
    res.json({ challenges });
  } catch (error) {
    logger.error('Error fetching user info:', { error });
    return next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {

  res.clearCookie('jwt');
  res.clearCookie('refreshToken');
  logger.info('Cookies cleared: jwt and refreshToken');

  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', { error: err });
      return next(new Error('로그아웃 실패')); 
    }
    res.status(200).json({ message: '로그아웃 성공' });
  });
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    logger.error('Invalid user data:', { user: req.user });
    return next(new AuthenticationError('Unauthorized'));
  }

  const userId = req.user.id;

  try {
    await userService.deleteUser(userId);
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '계정 탈퇴 완료' });
  } catch (deleteError) {
    logger.error('Error deleting user:', { error: deleteError });
    return next(deleteError);
  }
};
