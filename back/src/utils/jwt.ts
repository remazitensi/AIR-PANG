import jwt from 'jsonwebtoken';
import { config } from '@_config/env.config';

export const generateJWT = (user: any) => {
  return jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });
};
