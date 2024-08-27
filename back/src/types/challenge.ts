import { RowDataPacket } from 'mysql2';

// Task 타입 정의
export interface Task extends RowDataPacket {
  id: number;
  challenge_id: number;
  description: string;
  is_completed: boolean;
}

// Challenge 타입 정의
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

// CreateChallengeInput 타입 정의
export interface CreateChallengeInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  tasks: Task[];  // Task[] 타입으로 변경
}

// UpdateChallengeInput 타입 정의
export interface UpdateChallengeInput {
  title: string;  // 필수 필드로 변경
  description: string;  // 필수 필드로 변경
  start_date: string;  // 필수 필드로 변경
  end_date: string;  // 필수 필드로 변경
}
