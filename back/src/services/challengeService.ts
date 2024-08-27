import { ChallengeRepository } from '@_repositories/challengeRepository';
import { CreateChallengeDto, UpdateChallengeDto } from '@_dto/challenge.dto';

export class ChallengeService {
  private challengeRepository: ChallengeRepository;

  constructor() {
    this.challengeRepository = new ChallengeRepository();
  }

  public async getAllChallenges(searchQuery: string, page: number, limit: number) {
    try {
      return await this.challengeRepository.getAllChallenges(searchQuery, page, limit);
    } catch (error) {
      throw new Error('챌린지 목록을 가져오는 중 오류가 발생했습니다.');
    }
  }

  public async getChallengeById(id: string) {
    try {
      return await this.challengeRepository.getChallengeById(id);
    } catch (error) {
      throw new Error(`${id} 아이디의 챌린지 데이터를 가져오는 중 오류가 발생했습니다.`);
    }
  }

  public async createChallenge(userId: number, input: CreateChallengeDto) {
    try {
      return await this.challengeRepository.createChallenge(userId, input);
    } catch (error) {
      throw new Error('챌린지 생성 중 오류가 발생했습니다.');
    }
  }

  public async updateChallenge(id: string, input: UpdateChallengeDto) {
    try {
      return await this.challengeRepository.updateChallenge(id, input);
    } catch (error) {
      throw new Error(`${id} 아이디의 챌린지 수정 중 오류가 발생했습니다.`);
    }
  }

  public async deleteChallenge(id: string) {
    try {
      await this.challengeRepository.deleteChallenge(id);
    } catch (error) {
      throw new Error(`${id} 아이디의 챌린지 삭제 중 오류가 발생했습니다.`);
    }
  }
}
