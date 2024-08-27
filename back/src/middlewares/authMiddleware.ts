import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@_services/authService';
import { AuthRepository } from '@_repositories/authRepository';
import logger from '@_utils/logger';
import { config } from '@_config/env.config';
import { AuthenticationError, AuthorizationError } from 'utils/customError';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

interface JwtPayload {
  id: number;
}

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (decoded && typeof decoded === 'object' && 'id' in decoded) {
        resolve(decoded as JwtPayload);
      } else {
        reject(new Error('Invalid token'));
      }
    });
  });
};

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    logger.warn('No token found in cookies');
    return next(new AuthenticationError('No token found in cookies'));
  }

  try {
    const decoded = await verifyToken(token, config.JWT_SECRET);
    const user = await authService.findUserById(decoded.id);

    if (!user) {
      logger.error(`User not found for ID: ${decoded.id}`);
      return next(new AuthorizationError('User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error('JWT authentication error:', err);
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AuthenticationError('Token expired'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      return next(new AuthenticationError('Invalid token'));
    } else {
      return next(err);
    }
  }
};
