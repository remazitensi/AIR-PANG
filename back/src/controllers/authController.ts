import { Request, Response } from 'express';
import { getAuthUrl, handleOAuthCallback, getTokenInfo } from '@_services/authService';

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const tokens = await handleOAuthCallback(code);
  res.send(tokens);
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken as string;
  // 여기에 refreshAccessToken 로직을 추가
  // 예시: const newTokens = await refreshAccessToken(refreshToken);
  // res.send(newTokens);
};

export const generateAuthUrl = (req: Request, res: Response) => {
  const url = getAuthUrl();
  res.send({ url });
};

export const tokenInfo = async (req: Request, res: Response) => {
  const accessToken = req.query.accessToken as string;
  const info = await getTokenInfo(accessToken);
  res.send(info);
};
