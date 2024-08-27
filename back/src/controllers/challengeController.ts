import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { ChallengeService } from '@_services/challengeService';
import { GetAllChallengesDto, GetChallengeByIdDto, CreateChallengeDto, UpdateChallengeDto } from '@_dto/challenge.dto';
import { validateDto } from '@_middlewares/validateDto';
import { NotFoundError, AuthorizationError } from '@_utils/customError';
import logger from '@_utils/logger';

export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  // 모든 챌린지 가져오기
  public getAllChallengesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getAllChallengesDto = plainToInstance(GetAllChallengesDto, req.query);
      await validateDto(GetAllChallengesDto, getAllChallengesDto);

      const search = getAllChallengesDto.search || '';
      const page = getAllChallengesDto.page ?? 1;  
      const limit = getAllChallengesDto.limit ?? 4;  

      const { challenges, total } = await this.challengeService.getAllChallenges(search, page, limit);
      return res.status(200).json({ challenges, total });
    } catch (error) {
      logger.error('Failed to retrieve challenges.', { error });
      next(error);
    }
  };

  // ID로 챌린지 가져오기
  public getChallengeByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getChallengeByIdDto = plainToInstance(GetChallengeByIdDto, req.params);
      await validateDto(GetChallengeByIdDto, getChallengeByIdDto);
  
      const { id } = getChallengeByIdDto;
      const { challenge, tasks } = await this.challengeService.getChallengeById(id);
      if (!challenge) throw new NotFoundError('Challenge', id);
      
      return res.status(200).json({ challenge, tasks, userId: req.user!.id });
    } catch (error) {
      logger.error(`Failed to retrieve challenge for user ${req.params.id}.`, { error });
      next(error);
    }
  };

  // 챌린지 생성
  public createChallengeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createChallengeDto = plainToInstance(CreateChallengeDto, req.body);
      await validateDto(CreateChallengeDto, createChallengeDto);

      const newChallenge = await this.challengeService.createChallenge(req.user!.id, createChallengeDto);
      return res.status(201).json(newChallenge);
    } catch (error) {
      logger.error('Failed to create challenge.', { error });
      next(error);
    }
  };

  // 챌린지 업데이트
  public updateChallengeController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const updateChallengeDto = plainToInstance(UpdateChallengeDto, req.body);
      await validateDto(UpdateChallengeDto, updateChallengeDto);

      const { challenge } = await this.challengeService.getChallengeById(id);
      if (!challenge) throw new NotFoundError('Challenge', id);

      if (challenge.user_id !== req.user!.id) {
        throw new AuthorizationError('You do not have permission to update this challenge');
      }

      const updatedChallenge = await this.challengeService.updateChallenge(id, updateChallengeDto);
      return res.status(200).json(updatedChallenge);
    } catch (error) {
      logger.error(`Failed to update challenge ${id}.`, { error });
      next(error);
    }
  };

  // 챌린지 삭제
  public deleteChallengeController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { challenge } = await this.challengeService.getChallengeById(id);
      if (!challenge) throw new NotFoundError('Challenge', id);

      if (challenge.user_id !== req.user!.id) {
        throw new AuthorizationError('You do not have permission to delete this challenge');
      }

      await this.challengeService.deleteChallenge(id);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Failed to delete challenge ${id}.`, { error });
      next(error);
    }
  };
}
