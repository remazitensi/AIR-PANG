import { RowDataPacket } from 'mysql2';

export interface Task {
  id: number;
  challenge_id: number;
  description: string;
  is_completed: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goal: number;
  progress: number;
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

// 헬퍼 함수: RowDataPacket을 Challenge 타입으로 변환
export const mapRowToChallenge = (row: RowDataPacket): Challenge => ({
  id: row.id,
  title: row.title,
  description: row.description,
  start_date: row.start_date,
  end_date: row.end_date,
  goal: row.goal,
  progress: row.progress,
});

// 헬퍼 함수: RowDataPacket을 Task 타입으로 변환
export const mapRowToTask = (row: RowDataPacket): Task => ({
  id: row.id,
  challenge_id: row.challenge_id,
  description: row.description,
  is_completed: row.is_completed,
});
