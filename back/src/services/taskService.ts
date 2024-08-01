import connection from '@_config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Task, CreateTaskInput, UpdateTaskInput, mapRowToTask } from '@_types/task';

export const createTask = async ({ challenge_id, description }: CreateTaskInput): Promise<Task> => {
  const [result] = await connection.promise().query<ResultSetHeader>(
    `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
    [challenge_id, description, false]
  );
  const taskId = result.insertId;
  
  const [createdTaskRows] = await connection.promise().query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ?`,
    [taskId]
  );
  const createdTask = mapRowToTask(createdTaskRows[0]);
  
  return createdTask;
};

export const updateTask = async (id: string, { description, is_completed }: UpdateTaskInput): Promise<Task> => {
  await connection.promise().query(
    `UPDATE tasks SET description = ?, is_completed = ? WHERE id = ?`,
    [description, is_completed, id]
  );

  const [updatedTaskRows] = await connection.promise().query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ?`,
    [id]
  );
  const updatedTask = mapRowToTask(updatedTaskRows[0]);
  
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  await connection.promise().query(
    `DELETE FROM tasks WHERE id = ?`,
    [id]
  );
};
