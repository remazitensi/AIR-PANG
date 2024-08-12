import pool from '@_config/db.config';
import { ResultSetHeader } from 'mysql2';
import { Task, CreateTaskInput, UpdateTaskInput } from '@_types/task';

export class TaskRepository {
  public async createTask({ challenge_id, description }: CreateTaskInput): Promise<Task> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
      [challenge_id, description, false]
    );
    const taskId = result.insertId;

    const [createdTaskRows] = await pool.query<Task[]>(
      `SELECT * FROM tasks WHERE id = ?`,
      [taskId]
    );
    return createdTaskRows[0];
  }

  public async updateTask(id: string, { description, is_completed }: UpdateTaskInput): Promise<Task> {
    await pool.query(
      `UPDATE tasks SET description = ?, is_completed = ? WHERE id = ?`,
      [description, is_completed, id]
    );

    const [updatedTaskRows] = await pool.query<Task[]>(
      `SELECT * FROM tasks WHERE id = ?`,
      [id]
    );
    return updatedTaskRows[0];
  }

  public async deleteTask(id: string): Promise<void> {
    await pool.query(
      `DELETE FROM tasks WHERE id = ?`,
      [id]
    );
  }
}
