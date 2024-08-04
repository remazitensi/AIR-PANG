import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  googleId: string;
  name: string;
  googleAccessToken: string;
  googleRefreshToken: string;
}
