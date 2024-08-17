import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@_services/authService';
import { AuthRepository } from '@_repositories/authRepository';
import logger from '@_utils/logger';
import { config } from '@_config/env.config';
import { User } from '@_types/user';

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

const handleTokenError = (err: unknown, res: Response): Response => {
  if (err instanceof jwt.TokenExpiredError) {
    logger.error('TokenExpiredError:', err.message);
    return res.status(401).json({ message: 'TokenExpiredError: jwt expired' });
  } else if (err instanceof jwt.JsonWebTokenError) {
    logger.error('JWT Verification Error:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  } else {
    logger.error('Unknown Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    logger.warn('No token found in cookies');
    return res.sendStatus(401);
  }

  try {
    const decoded = await verifyToken(token, config.JWT_SECRET);

    const user = await authService.findUserById(decoded.id);
    if (!user) {
      logger.error(`User not found for ID: ${decoded.id}`);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (err) {
    return handleTokenError(err, res);
  }
};
