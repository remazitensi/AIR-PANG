import connection from '@_config/db.config';
import { ResultSetHeader } from 'mysql2';
import { Task, CreateTaskInput, UpdateTaskInput } from '@_types/task';

export const createTask = async ({ challenge_id, description }: CreateTaskInput): Promise<Task> => {
  const [result] = await connection.promise().query<ResultSetHeader>(
    `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
    [challenge_id, description, false]
  );
  const taskId = result.insertId;
  
  const [createdTaskRows] = await connection.promise().query<Task[]>(
    `SELECT * FROM tasks WHERE id = ?`,
    [taskId]
  );
  return createdTaskRows[0];
};

export const updateTask = async (id: string, { description, is_completed }: UpdateTaskInput): Promise<Task> => {
  await connection.promise().query(
    `UPDATE tasks SET description = ?, is_completed = ? WHERE id = ?`,
    [description, is_completed, id]
  );

  const [updatedTaskRows] = await connection.promise().query<Task[]>(
    `SELECT * FROM tasks WHERE id = ?`,
    [id]
  );
  return updatedTaskRows[0];
};

export const deleteTask = async (id: string): Promise<void> => {
  await connection.promise().query(
    `DELETE FROM tasks WHERE id = ?`,
    [id]
  );
};
