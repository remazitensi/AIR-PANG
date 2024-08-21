import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@_services/authService';
import { AuthRepository } from '@_repositories/authRepository';
import logger from '@_utils/logger';
import { config } from '@_config/env.config';
import { User } from '@_types/user';
import { AuthenticationError, AuthorizationError, NotFoundError } from 'utils/customError';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

// 구글 OAuth 콜백 처리 및 쿠키 설정
export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    
    if (!user) {
      logger.error(`[googleAuthCallback] No user found in request at ${new Date().toISOString()}`);
      return next(new AuthenticationError('No user found in request'));
    }

    const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ id: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await authService.saveRefreshToken(user.id, refreshToken);

    // 쿠키 설정
    res.cookie('jwt', accessToken, { httpOnly: true, secure: config.SECURE_COOKIES, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config.SECURE_COOKIES, sameSite: 'strict' });

    logger.info(`[googleAuthCallback] User ${user.id} authenticated and tokens issued at ${new Date().toISOString()}`);
    res.redirect(config.CLIENT_URL || '');
  } catch (err) {
    next(err); 
  }
};

// 리프레시 토큰을 이용한 액세스 토큰 갱신
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    logger.error(`[refreshToken] Refresh token not provided at ${new Date().toISOString()}`);
    return next(new AuthenticationError('Refresh token not provided'));
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { id: number };
    const user = await authService.findUserById(decoded.id);

    if (!user) {
      logger.error(`[refreshToken] User with ID ${decoded.id} not found at ${new Date().toISOString()}`);
      return next(new NotFoundError('User', decoded.id.toString()));
    }

    const newAccessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('jwt', newAccessToken, { httpOnly: true, secure: config.SECURE_COOKIES, sameSite: 'strict' });

    logger.info(`[refreshToken] New access token issued for user ${user.id} at ${new Date().toISOString()}`);
    
    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.error(`[refreshToken] Invalid refresh token at ${new Date().toISOString()}: ${err.message}`);
      return next(new AuthorizationError('Invalid refresh token'));
    } else {
      next(err);
    }
  }
};
