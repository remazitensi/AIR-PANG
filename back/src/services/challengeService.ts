import connection from '@_config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Task, Challenge, CreateChallengeInput, UpdateChallengeInput, mapRowToChallenge, mapRowToTask } from '@_types/challenge';

export const getAllChallenges = async (searchQuery: string): Promise<Challenge[]> => {
  const query = `SELECT * FROM challenges WHERE title LIKE ?`;
  const [rows] = await connection.promise().query<RowDataPacket[]>(query, [`%${searchQuery}%`]);
  return rows.map(mapRowToChallenge);
};

export const getChallengeById = async (id: string): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const [challengeRows] = await connection.promise().query<RowDataPacket[]>(
    `SELECT * FROM challenges WHERE id = ?`,
    [id]
  );
  
  if (challengeRows.length === 0) {
    throw new Error('챌린지가 없습니다.');
  }

  const challenge = mapRowToChallenge(challengeRows[0]);

  const [taskRows] = await connection.promise().query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE challenge_id = ?`,
    [id]
  );

  const tasks = taskRows.map(mapRowToTask);
  return { challenge, tasks };
};

export const createChallenge = async ({ title, description, start_date, end_date, tasks }: CreateChallengeInput): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const [result] = await connection.promise().query<ResultSetHeader>(
    `INSERT INTO challenges (title, description, start_date, end_date, goal, progress) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, start_date, end_date, tasks.length, 0]
  );
  const challengeId = result.insertId;

  const taskQueries = tasks.map(task =>
    connection.promise().query<ResultSetHeader>(
      `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
      [challengeId, task.description, task.is_completed]
    )
  );
  await Promise.all(taskQueries);

  const [createdChallengeRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM challenges WHERE id = ?`, [challengeId]);
  const createdChallenge = mapRowToChallenge(createdChallengeRows[0]);

  const [createdTaskRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM tasks WHERE challenge_id = ?`, [challengeId]);
  const createdTasks = createdTaskRows.map(mapRowToTask);

  return { challenge: createdChallenge, tasks: createdTasks };
};

export const updateChallenge = async (id: string, { title, description, start_date, end_date }: UpdateChallengeInput): Promise<Challenge> => {
  await connection.promise().query(
    `UPDATE challenges SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?`,
    [title, description, start_date, end_date, id]
  );

  const [updatedChallengeRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM challenges WHERE id = ?`, [id]);
  const updatedChallenge = mapRowToChallenge(updatedChallengeRows[0]);

  return updatedChallenge;
};

export const deleteChallenge = async (id: string): Promise<void> => {
  // 먼저 관련된 모든 할 일 삭제
  await connection.promise().query(`DELETE FROM tasks WHERE challenge_id = ?`, [id]);

  // 챌린지 삭제
  await connection.promise().query(`DELETE FROM challenges WHERE id = ?`, [id]);
};
