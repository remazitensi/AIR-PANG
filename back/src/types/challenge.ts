import { RowDataPacket } from 'mysql2';

export interface Task extends RowDataPacket {
  id: number;
  challenge_id: number;
  description: string;
  is_completed: boolean;
}

export interface Challenge extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goal: number;
  progress: number;
  user_name?: string;
}

export interface CreateChallengeInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  tasks: Omit<Task, 'id' | 'challenge_id'>[];
}

export interface UpdateChallengeInput {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}
