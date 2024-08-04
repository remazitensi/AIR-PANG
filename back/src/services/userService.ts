import connection from '@_config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class UserService {
  // 사용자 마이페이지 정보 및 참여중인 환경 챌린지 목록 조회
  async getUserProfileAndChallenges(userId: number): Promise<{ userLocations: any[], challenges: any[] }> {
    const [userLocations] = await connection.promise().query<RowDataPacket[]>(
      'SELECT id, location_id FROM user_locations WHERE user_id = ?',
      [userId]
    );

    const [challenges] = await connection.promise().query<RowDataPacket[]>(
      `SELECT 
         c.id, 
         c.challenge_id, 
         c.title, 
         c.description, 
         c.status, 
         c.start_date, 
         c.end_date 
       FROM challenges c
       JOIN user_challenges uc ON c.id = uc.challenge_id
       WHERE uc.user_id = ?`,
      [userId]
    );

    return { userLocations: userLocations as any[], challenges: challenges as any[] };
  }

  // 관심지역 페이지 조회
  async searchLocations(query: string): Promise<any[]> {
    const [locations] = await connection.promise().query<RowDataPacket[]>(
      'SELECT id, name, description FROM locations WHERE name LIKE ?',
      [`%${query}%`]
    );
    return locations as any[];
  }

  // 사용자 정보 업데이트
  async updateUser(userId: number, userData: { name?: string; email?: string; location_ids?: number[] }): Promise<any> {
    const { name, email, location_ids } = userData;

    // 사용자의 정보 업데이트
    const [result] = await connection.promise().query<ResultSetHeader>(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    // location_ids가 있을 경우, 관심지역 업데이트 처리
    if (location_ids) {
      await connection.promise().query('DELETE FROM user_locations WHERE user_id = ?', [userId]);
      const locationValues = location_ids.map(locationId => [userId, locationId]);
      if (locationValues.length > 0) {
        await connection.promise().query('INSERT INTO user_locations (user_id, location_id) VALUES ?', [locationValues]);
      }
    }

    return result.affectedRows > 0 ? { userId, name, email, location_ids } : null;
  }
}
