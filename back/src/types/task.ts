import { RowDataPacket } from 'mysql2';

export interface Task {
  id: number;
  challenge_id: number;
  description: string;
  is_completed: boolean;
}

export interface CreateTaskInput {
  challenge_id: number;
  description: string;
}

export interface UpdateTaskInput {
  description?: string;
  is_completed?: boolean;
}

// 헬퍼 함수: RowDataPacket을 Task 타입으로 변환
export const mapRowToTask = (row: RowDataPacket): Task => ({
  id: row.id,
  challenge_id: row.challenge_id,
  description: row.description,
  is_completed: row.is_completed,
});
