import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '@_config/db.config'; // connection 대신 pool 사용
import { User } from '@_types/user';

export class UserService {
  // 기존 메서드들...

  async findOrCreateUser(googleUser: any): Promise<User> {
    try {
      const [existingUserRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE googleId = ?',
        [googleUser.googleId]
      );

      if (existingUserRows.length > 0) {
        return existingUserRows[0] as User;
      } else {
        const [result] = await pool.query<ResultSetHeader>(
          'INSERT INTO users (googleId, name, googleAccessToken, googleRefreshToken) VALUES (?, ?, ?, ?)',
          [googleUser.googleId, googleUser.name, googleUser.googleAccessToken, googleUser.googleRefreshToken]
        );

        const insertId = result.insertId;
        return {
          id: insertId,
          googleId: googleUser.googleId,
          name: googleUser.name,
          googleAccessToken: googleUser.googleAccessToken,
          googleRefreshToken: googleUser.googleRefreshToken,
        } as User;
      }
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw error;
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
        [id]
      );

      if (rows.length > 0) {
        return rows[0] as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in findUserById:', error);
      throw error;
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET googleRefreshToken = ? WHERE id = ?',
        [refreshToken, userId]
      );
    } catch (error) {
      console.error('Error in saveRefreshToken:', error);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET deleted_at = NOW() WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}
