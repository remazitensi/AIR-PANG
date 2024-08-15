import { UserRepository } from '@_repositories/UserRepository'; 
import { RowDataPacket } from 'mysql2/promise';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 사용자 마이페이지 정보 및 작성한 챌린지 목록 조회
  async getUserProfileAndChallenges(userId: number): Promise<{ challenges: any[] }> {
    const results: RowDataPacket[] = await this.userRepository.findUserChallengesAndTasks(userId);

    const challengesMap: { [key: number]: any } = {};

    results.forEach((row: any) => {
      if (!challengesMap[row.id]) {
        challengesMap[row.id] = {
          id: row.id,
          title: row.title,
          goal: row.goal,
          progress: row.progress,
          start_date: row.start_date,
          end_date: row.end_date,
          tasks: []
        };
      }

      if (row.task_id) {
        challengesMap[row.id].tasks.push({
          id: row.task_id,
          description: row.task_description,
          is_completed: row.task_is_completed
        });
      }
    });

    // 작업이 있는 챌린지만 반환
    const challenges = Object.values(challengesMap).filter((challenge: any) => challenge.tasks.length > 0);

    return { challenges };
  }

  // 사용자 삭제
  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
