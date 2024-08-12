import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ChallengeService } from '@_services/challengeService';
import { CreateChallengeDto, UpdateChallengeDto } from '@_dto/challenge.dto';
import { User } from '@_types/user'
import logger from '@_utils/logger';

export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  public getAllChallengesController = async (req: Request, res: Response) => {
    const searchQuery = req.query.search ? req.query.search.toString() : '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;

    try {
      const { challenges, total } = await this.challengeService.getAllChallenges(searchQuery, page, limit);
      return res.status(200).json({ challenges, total });
    } catch (error) {
      logger.error('챌린지 데이터를 가져오는데 실패 했습니다.', { error });
      return res.status(500);
    }
  };

  public getChallengeByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const { challenge, tasks } = await this.challengeService.getChallengeById(id);
      const user = req.user as User;
      const userId = user.id;
      return res.status(200).json({ challenge, tasks, userId }); 
    } catch (error) {
      logger.error(`${id} 아이디의 챌린지 데이터를 가져오는데 실패 했습니다.`, { error });
      return res.status(500);
    }
  };

  public createChallengeController = async (req: Request, res: Response) => {
    const input = plainToClass(CreateChallengeDto, req.body);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('유효성 검사 실패:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const userId = (req.user as User).id;
      if (!userId) {
        return res.status(401);
      }

      const newChallenge = await this.challengeService.createChallenge(userId, input);
      return res.status(201).json(newChallenge);
    } catch (error) {
      logger.error('챌린지 생성을 실패 했습니다.', { error });
      return res.status(500);
    }
  };

  public updateChallengeController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const input = plainToClass(UpdateChallengeDto, req.body);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('유효성 검사 실패:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const { challenge } = await this.challengeService.getChallengeById(id);
      if (challenge.user_id !== (req.user as User).id) {
        return res.status(403);
      }

      const updatedChallenge = await this.challengeService.updateChallenge(id, input);
      return res.status(204).json(updatedChallenge);
    } catch (error) {
      logger.error(`${id} 아이디의 챌린지 수정을 실패 했습니다.`, { error });
      return res.status(500);
    }
  };

  public deleteChallengeController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const { challenge } = await this.challengeService.getChallengeById(id);
      if (challenge.user_id !== (req.user as User).id) {
        return res.status(403);
      }

      await this.challengeService.deleteChallenge(id);
      return res.status(204).send();
    } catch (error) {
      logger.error(`${id} 아이디의 챌린지 삭제를 실패 했습니다.`, { error });
      return res.status(500);
    }
  };
}
