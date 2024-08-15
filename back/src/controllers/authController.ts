import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@_services/authService';
import { AuthRepository } from '@_repositories/authRepository';
import logger from '@_utils/logger';
import { config } from '@_config/env.config';
import { User } from '@_types/user';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

// Google OAuth 콜백 처리
export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('User in request:', req.user);
    const user = req.user as User;
    if (!user) {
      logger.error('No user found in request');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // 액세스 토큰과 리프레시 토큰 생성
    const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // 리프레시 토큰을 데이터베이스에 저장
    await authService.saveRefreshToken(user.id, refreshToken);

    // 쿠키에 액세스 토큰과 리프레시 토큰 저장
    res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // 클라이언트로 리디렉션
    res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${accessToken}`);
  } catch (error) {
    logger.error('Error in googleAuthCallback:', error);
    res.status(500).json({ message: 'Failed to create token' });
  }
};

// 리프레시 토큰을 이용한 액세스 토큰 갱신
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.error('Refresh token not provided');
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    // 리프레시 토큰 검증 및 디코딩
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { id: number };
    
    // 디코딩된 ID로 사용자 조회
    const user = await authService.findUserById(decoded.id);  // 여기서 `findUserById`를 사용
    
    if (!user) {
      logger.error('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // 새 액세스 토큰 생성
    const newAccessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });

    // 쿠키에 새 액세스 토큰 저장
    res.cookie('jwt', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error('Invalid refresh token:', error);
      return res.status(403).json({ message: 'Invalid refresh token' });
    } else {
      logger.error('Error in refreshToken:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
