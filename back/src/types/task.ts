import { RowDataPacket } from 'mysql2';

export interface Task extends RowDataPacket {
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
