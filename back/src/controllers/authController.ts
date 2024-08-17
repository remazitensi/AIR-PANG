import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@_services/authService';
import { AuthRepository } from '@_repositories/authRepository';
import logger from '@_utils/logger';
import { config } from '@_config/env.config';
import { User } from '@_types/user';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

// 구글 OAuth 콜백 처리 및 쿠키 설정
export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    
    if (!user) {
      logger.error(`[googleAuthCallback] No user found in request at ${new Date().toISOString()}`);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await authService.saveRefreshToken(user.id, refreshToken);

    // 쿠키 설정
    res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    logger.info(`[googleAuthCallback] User ${user.id} authenticated and tokens issued at ${new Date().toISOString()}`);

    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`[googleAuthCallback] Error processing Google callback for user ${req.user?.id || 'unknown'} at ${new Date().toISOString()}: ${error.message}`, { error });
      res.status(500).json({ message: 'Failed to create token' });
    } else {
      logger.error(`[googleAuthCallback] Unknown error type at ${new Date().toISOString()}`, { error });
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// 리프레시 토큰을 이용한 액세스 토큰 갱신
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.error(`[refreshToken] Refresh token not provided at ${new Date().toISOString()}`);
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { id: number };
    const user = await authService.findUserById(decoded.id);

    if (!user) {
      logger.error(`[refreshToken] User with ID ${decoded.id} not found at ${new Date().toISOString()}`);
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('jwt', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    logger.info(`[refreshToken] New access token issued for user ${user.id} at ${new Date().toISOString()}`);
    
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error(`[refreshToken] Invalid refresh token for user ${req.user?.id || 'unknown'} at ${new Date().toISOString()}: ${error.message}`);
      res.status(403).json({ message: 'Invalid refresh token' });
    } else if (error instanceof Error) {
      logger.error(`[refreshToken] Error processing refresh token for user ${req.user?.id || 'unknown'} at ${new Date().toISOString()}: ${error.message}`, { error });
      res.status(500).json({ message: 'Internal server error' });
    } else {
      logger.error(`[refreshToken] Unknown error type at ${new Date().toISOString()}`, { error });
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
