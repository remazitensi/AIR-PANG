import connection from '@_config/db.config';
import { Task, Challenge, CreateChallengeInput, UpdateChallengeInput} from '@_types/challenge';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// 모든 챌린지 가져오기
export const getAllChallenges = async (searchQuery: string, page: number, limit: number): Promise<{ challenges: Challenge[], total: number }> => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT SQL_CALC_FOUND_ROWS c.*, u.name AS user_name
    FROM challenges c
    JOIN users u ON c.user_id = u.id
    WHERE c.title LIKE ?
    LIMIT ?, ?
  `;
  const [rows] = await connection.promise().query<Challenge[] & RowDataPacket[]>(query, [`%${searchQuery}%`, offset, limit]);

  const [totalRows] = await connection.promise().query<RowDataPacket[]>(`SELECT FOUND_ROWS() as total`);
  const total = totalRows[0].total as number;

  return { challenges: rows, total };
};
// 특정 챌린지 가져오기
export const getChallengeById = async (id: string): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const query = `
    SELECT c.*, u.name AS user_name 
    FROM challenges c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = ?`;
  const [challengeRows] = await connection.promise().query<Challenge[]>(query, [id]);

  if (challengeRows.length === 0) {
    throw new Error('챌린지가 없습니다.');
  }

  const challenge = challengeRows[0];

  const [taskRows] = await connection.promise().query<Task[]>(
    `SELECT * FROM tasks WHERE challenge_id = ?`,
    [id]
  );

  return { challenge, tasks: taskRows };
};

// 챌린지 생성하기
export const createChallenge = async (userId: number, { title, description, start_date, end_date, tasks }: CreateChallengeInput): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const [result] = await connection.promise().query<ResultSetHeader>(
    `INSERT INTO challenges (user_id, title, description, start_date, end_date, goal, progress) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, description, start_date, end_date, tasks.length, 0]
  );
  const challengeId = result.insertId;

  const taskQueries = tasks.map(task =>
    connection.promise().query<Task[]>(
      `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
      [challengeId, task.description, task.is_completed]
    )
  );
  await Promise.all(taskQueries);

  const [createdChallengeRows] = await connection.promise().query<Challenge[]>(`SELECT * FROM challenges WHERE id = ?`, [challengeId]);
  const createdChallenge = createdChallengeRows[0];

  const [createdTaskRows] = await connection.promise().query<Task[]>(`SELECT * FROM tasks WHERE challenge_id = ?`, [challengeId]);

  return { challenge: createdChallenge, tasks: createdTaskRows };
};

// 챌린지 수정하기
export const updateChallenge = async (id: string, { title, description, start_date, end_date }: UpdateChallengeInput): Promise<Challenge> => {
  await connection.promise().query(
    `UPDATE challenges SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?`,
    [title, description, start_date, end_date, id]
  );

  const [updatedChallengeRows] = await connection.promise().query<Challenge[]>(`SELECT * FROM challenges WHERE id = ?`, [id]);
  const updatedChallenge = updatedChallengeRows[0];

  return updatedChallenge;
};

// 챌린지 삭제하기
export const deleteChallenge = async (id: string): Promise<void> => {
  // 먼저 관련된 모든 할 일 삭제
  await connection.promise().query(`DELETE FROM tasks WHERE challenge_id = ?`, [id]);

  // 챌린지 삭제
  await connection.promise().query(`DELETE FROM challenges WHERE id = ?`, [id]);
};
