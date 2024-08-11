import pool from '@_config/db.config'; // connection 대신 pool 사용
import { RowDataPacket } from 'mysql2/promise';

export class UserService {
  // 사용자 마이페이지 정보 및 작성한 챌린지 목록 조회
  async getUserProfileAndChallenges(userId: number): Promise<{ challenges: any[] }> {
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

    // 챌린지와 그에 해당하는 작업을 그룹화
    const challengesMap: { [key: number]: any } = {};

    results.forEach((row: any) => {
      if (!challengesMap[row.id]) {
        challengesMap[row.id] = {
          id: row.id,
          title: row.title,
          goal: row.goal,
          progress: row.progress,
          start_date: row.start_date,
          end_date: row.end_date,
          tasks: []
        };
      }

      if (row.task_id) {
        challengesMap[row.id].tasks.push({
          id: row.task_id,
          description: row.task_description,
          is_completed: row.task_is_completed
        });
      }
    });

    // 작업이 있는 챌린지만 반환
    const challenges = Object.values(challengesMap);

    return { challenges };
  }
}
