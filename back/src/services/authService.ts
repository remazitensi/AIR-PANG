import { OAuth2Client, Credentials } from 'google-auth-library';
import { config } from '@_config/env.config';

const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile'];

const oAuth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI);

export const getAuthUrl = (): string => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
};

export const handleOAuthCallback = async (code: string): Promise<Credentials> => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  
  if (tokens.refresh_token) {
    console.log(`Refresh Token: ${tokens.refresh_token}`);
    // 데이터베이스에 저장하는 로직 추가
  }
  console.log(`Access Token: ${tokens.access_token}`);
  return tokens;
};

export const getTokenInfo = async (accessToken: string) => {
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(accessToken);
    return tokenInfo;
  } catch (error) {
    throw new Error('Invalid token');
  }
};