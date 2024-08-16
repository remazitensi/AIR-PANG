import pool from '@_config/db.config';
import { CreateChallengeDto, UpdateChallengeDto } from '@_dto/challenge.dto';
import { Challenge, Task } from '@_types/challenge';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ChallengeRepository {
  public async getAllChallenges(searchQuery: string, page: number, limit: number): Promise<{ challenges: Challenge[], total: number }> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT SQL_CALC_FOUND_ROWS c.*, u.name AS user_name
      FROM challenges c
      JOIN users u ON c.user_id = u.id
      WHERE c.title LIKE ?
      LIMIT ?, ?
    `;
    const [rows] = await pool.query<Challenge[] & RowDataPacket[]>(query, [`%${searchQuery}%`, offset, limit]);

    const [totalRows] = await pool.query<RowDataPacket[]>(`SELECT FOUND_ROWS() as total`);
    const total = totalRows[0].total as number;

    return { challenges: rows, total };
  }

  public async getChallengeById(id: string): Promise<{ challenge: Challenge, tasks: Task[] }> {
    const challengeQuery = `
      SELECT c.*, u.name AS user_name 
      FROM challenges c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = ?
    `;
    const [challengeRows] = await pool.query<Challenge[]>(challengeQuery, [id]);

    if (challengeRows.length === 0) {
      throw new Error('챌린지가 없습니다.');
    }

    const challenge = challengeRows[0];

    const taskQuery = `SELECT * FROM tasks WHERE challenge_id = ?`;
    const [taskRows] = await pool.query<Task[]>(taskQuery, [id]);

    return { challenge, tasks: taskRows };
  }

  public async createChallenge(userId: number, input: CreateChallengeDto): Promise<{ challenge: Challenge, tasks: Task[] }> {
    const initialProgress = 0; // 초기 진행률
    
    const insertChallengeQuery = `
      INSERT INTO challenges (user_id, title, description, start_date, end_date, goal, progress) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(insertChallengeQuery, [
      userId, 
      input.title, 
      input.description, 
      input.start_date, 
      input.end_date, 
      input.tasks.length, 
      initialProgress
    ]);
    const challengeId = result.insertId;

    for (const task of input.tasks) {
      await pool.query<Task[]>(
        `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
        [challengeId, task.description, task.is_completed]
      );
    }

    const [createdChallengeRows] = await pool.query<Challenge[]>(`SELECT * FROM challenges WHERE id = ?`, [challengeId]);
    const createdChallenge = createdChallengeRows[0];

    const [createdTaskRows] = await pool.query<Task[]>(`SELECT * FROM tasks WHERE challenge_id = ?`, [challengeId]);

    return { challenge: createdChallenge, tasks: createdTaskRows };
  }

  public async updateChallenge(id: string, input: UpdateChallengeDto): Promise<Challenge> {
    await pool.query(
      `UPDATE challenges SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?`,
      [input.title, input.description, input.start_date, input.end_date, id]
    );

    const [updatedChallengeRows] = await pool.query<Challenge[]>(`SELECT * FROM challenges WHERE id = ?`, [id]);
    return updatedChallengeRows[0];
  }

  public async deleteChallenge(id: string): Promise<void> {
    await pool.query(`DELETE FROM tasks WHERE challenge_id = ?`, [id]);
    await pool.query(`DELETE FROM challenges WHERE id = ?`, [id]);
  }
}
