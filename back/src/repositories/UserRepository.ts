import { RowDataPacket } from 'mysql2/promise';
import pool from '@_config/db.config'; // connection 대신 pool 사용

export class UserRepository {
  // 사용자 챌린지 및 작업 목록 조회
  async findUserChallengesAndTasks(userId: number): Promise<RowDataPacket[]> {
    const [results] = await pool.query<RowDataPacket[]>(
      `SELECT 
         challenges.id, 
         challenges.title, 
         challenges.goal, 
         challenges.progress, 
         challenges.start_date, 
         challenges.end_date, 
         tasks.id AS task_id, 
         tasks.description AS task_description, 
         tasks.is_completed AS task_is_completed
       FROM challenges
       LEFT JOIN tasks ON challenges.id = tasks.challenge_id
       WHERE challenges.user_id = ?
       ORDER BY challenges.id, tasks.id`,
      [userId]
    );

    return results;
  }

  // 사용자 삭제 (논리 삭제)
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
