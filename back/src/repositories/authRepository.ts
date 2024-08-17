import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '@_config/db.config';
import { User } from '@_types/user';
import logger from '@_utils/logger';

// 쿼리 반환 타입 정의
type QueryResult = RowDataPacket[] | ResultSetHeader;

const SQL_QUERIES = {
  findUserByGoogleId: 'SELECT * FROM users WHERE googleId = ?',
  insertUser: 'INSERT INTO users (googleId, name, googleAccessToken, googleRefreshToken) VALUES (?, ?, ?, ?)',
  findUserById: 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
  updateRefreshToken: 'UPDATE users SET googleRefreshToken = ? WHERE id = ?',
  deleteUser: 'UPDATE users SET deleted_at = NOW() WHERE id = ?'
};

export class AuthRepository {
  // 공통적인 쿼리 실행 메서드
  private async executeQuery<T extends QueryResult>(query: string, params: any[]): Promise<T> {
    try {
      const [rows] = await pool.query<T>(query, params);
      return rows;
    } catch (error) {
      logger.error(`Database query error: ${error}`);
      throw error;
    }
  }

  // 구글 ID로 사용자 조회
  async findUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const rows = await this.executeQuery<RowDataPacket[]>(SQL_QUERIES.findUserByGoogleId, [googleId]);
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      logger.error(`Error in findUserByGoogleId (Google ID: ${googleId}): ${error}`);
      throw error;
    }
  }

  // 사용자 생성
  async createUser(googleUser: {
    googleId: string;
    name: string;
    googleAccessToken: string;
    googleRefreshToken: string;
  }): Promise<User> {
    try {
      const result = await this.executeQuery<ResultSetHeader>(SQL_QUERIES.insertUser, [
        googleUser.googleId,
        googleUser.name,
        googleUser.googleAccessToken,
        googleUser.googleRefreshToken
      ]);

      const insertId = result.insertId;
      logger.info(`User created with ID: ${insertId}`);
      return {
        id: insertId,
        googleId: googleUser.googleId,
        name: googleUser.name,
        googleAccessToken: '',
        googleRefreshToken: ''
      } as User;
    } catch (error) {
      logger.error(`Error in createUser (Google ID: ${googleUser.googleId}): ${error}`);
      throw error;
    }
  }

  // 사용자 리프레시 토큰 저장
  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      await this.executeQuery<ResultSetHeader>(SQL_QUERIES.updateRefreshToken, [refreshToken, userId]);
      logger.info(`Refresh token updated for user ID: ${userId}`);
    } catch (error) {
      logger.error(`Error in saveRefreshToken (User ID: ${userId}): ${error}`);
      throw error;
    }
  }

  // 사용자 ID로 사용자 조회
  async findUserById(id: number): Promise<User | null> {
    try {
      const rows = await this.executeQuery<RowDataPacket[]>(SQL_QUERIES.findUserById, [id]);
      return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
      logger.error(`Error in findUserById (User ID: ${id}): ${error}`);
      throw error;
    }
  }

  // 사용자 삭제 (논리적 삭제)
  async deleteUser(userId: number): Promise<void> {
    try {
      await this.executeQuery<ResultSetHeader>(SQL_QUERIES.deleteUser, [userId]);
      logger.info(`User with ID ${userId} marked as deleted`);
    } catch (error) {
      logger.error(`Error in deleteUser (User ID: ${userId}): ${error}`);
      throw error;
    }
  }
}
