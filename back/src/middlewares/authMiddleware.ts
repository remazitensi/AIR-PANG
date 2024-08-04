// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { config } from '@_config/env.config';
// import { UserService } from '@_services/authService';

// const userService = new UserService();
// const jwtSecret = config.JWT_SECRET;

// interface JwtPayload {
//   id: number;
// }

// const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, secret, (err, decoded) => {
//       if (err) {
//         return reject(err);
//       }
//       if (decoded && typeof decoded === 'object' && 'id' in decoded) {
//         resolve(decoded as JwtPayload);
//       } else {
//         reject(new Error('Invalid token'));
//       }
//     });
//   });
// };

// export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.jwt;
  
//   console.log('Incoming request:', req.method, req.originalUrl);
//   console.log('Cookies:', req.cookies);
  
//   if (token) {
//     console.log('Token found in cookies:', token);
//     try {
//       const decoded = await verifyToken(token, jwtSecret);
//       console.log('Token verified, decoded payload:', decoded);

//       if (decoded) {
//         try {
//           const user = await userService.findUserById(decoded.id);
//           console.log('User retrieved from database:', user);

//           if (user) {
//             req.user = user;
//             next();
//           } else {
//             console.error('User not found for ID:', decoded.id);
//             res.sendStatus(403); // Forbidden
//           }
//         } catch (error) {
//           console.error('User Retrieval Error:', error);
//           res.sendStatus(403); // Forbidden
//         }
//       } else {
//         console.error('Token payload is invalid or missing ID');
//         res.sendStatus(403); // Forbidden
//       }
//     } catch (err) {
//       // 타입 가드 사용
//       if (err instanceof Error) {
//         if (err.name === 'TokenExpiredError') {
//           console.error('TokenExpiredError:', err.message);
//           return res.status(401).json({ message: 'TokenExpiredError: jwt expired' });
//         }
//         console.error('JWT Verification Error:', err.message);
//       } else {
//         console.error('Unknown Error:', err);
//       }
//       res.sendStatus(403); 
//     }
//   } else {
//     console.log('No token found in cookies');
//     res.sendStatus(401); 
//   }
// };
