// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { config } from '@_config/env.config';
// import passport from 'passport';
// import { User } from '@_types/user';
// import { UserService } from '@_services/authService';

// const userService = new UserService();

// export const googleAuth = passport.authenticate('google', { 
//   scope: [
//     'profile', 
//     'email', 
//     'openid', 
//     'https://www.googleapis.com/auth/userinfo.profile', 
//     'https://www.googleapis.com/auth/userinfo.email'
//   ] 
// });

// export const googleAuthCallback = (req: Request, res: Response) => {
//   passport.authenticate('google', { session: false }, async (err, user, info) => {
//     if (err) {
//       console.error('인증 오류:', err);
//       return res.status(500).json({ message: '내부 서버 오류' });
//     }

//     if (!user) {
//       console.error('사용자가 인증되지 않음');
//       return res.status(401).json({ message: '인증 실패' });
//     }

//     const userObj = user as User;
//     try {
//       const accessToken = jwt.sign({ id: userObj.id }, config.JWT_SECRET, { expiresIn: '15m' });
//       const refreshToken = jwt.sign({ id: userObj.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });

//       await userService.saveRefreshToken(userObj.id, refreshToken);

//       res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//       res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

//       res.redirect(process.env.CLIENT_URL || '/');
//     } catch (tokenError) {
//       console.error('Error creating JWT:', tokenError);
//       res.status(500).json({ message: '토큰 생성 실패' });
//     }
//   })(req, res);
// };

// export const refreshToken = async (req: Request, res: Response) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: '리프레시 토큰이 제공되지 않음' });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { id: number };
//     const user = await userService.findUserById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: '유효하지 않은 리프레시 토큰' });
//     }

//     const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '15m' });
//     res.cookie('jwt', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

//     res.json({ accessToken });
//   } catch (err) {
//     console.error('리프레시 토큰 검증 실패:', err);
//     res.status(403).json({ message: '유효하지 않은 리프레시 토큰' });
//   }
// };

// export const logout = (req: Request, res: Response) => {
//   res.clearCookie('jwt');
//   res.clearCookie('refreshToken');
//   req.logout((err) => {
//     if (err) {
//       console.error('Logout error:', err);
//       return res.status(500).json({ message: '로그아웃 실패' });
//     }
//     res.status(200).json({ message: '로그아웃 성공' });
//   });
// };

// export const deleteUser = async (req: Request, res: Response) => {
//   if (req.user) {
//     const user = req.user as User;
//     try {
//       await userService.deleteUser(user.id);
//       res.clearCookie('jwt');
//       res.clearCookie('refreshToken');
//       res.status(200).json({ message: '계정 탈퇴 완료' });
//     } catch (deleteError) {
//       console.error('Error deleting user:', deleteError);
//       res.status(500).json({ message: '계정 탈퇴 실패' });
//     }
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };
