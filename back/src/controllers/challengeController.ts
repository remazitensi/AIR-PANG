import { Request, Response } from 'express';
import {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '@_services/challengeService';

// 모든 챌린지 가져오기
export const getAllChallengesController = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search ? req.query.search.toString() : '';
    const challenges = await getAllChallenges(searchQuery);
    res.status(200).json({ challenges });
  } catch (error) {
    console.error('챌린지 데이터를 가져오는데 실패 했습니다.', error);
    res.status(500).send('서버 오류발생');
  }
};

// 특정 챌린지 가져오기
export const getChallengeByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { challenge, tasks } = await getChallengeById(id);
    res.status(200).json({ challenge, tasks });
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 데이터를 가져오는데 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};

// 챌린지 생성하기
export const createChallengeController = async (req: Request, res: Response) => {
  const { title, description, start_date, end_date, tasks } = req.body;
  try {
    const newChallenge = await createChallenge({ title, description, start_date, end_date, tasks});
    res.status(201).json(newChallenge);
  } catch (error) {
    console.error('챌린지 생성을 실패 했습니다.:', error);
    res.status(500).send('서버 오류발생');
  }
};

// 챌린지 수정하기
export const updateChallengeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, start_date, end_date } = req.body;
  try {
    const updatedChallenge = await updateChallenge(id, { title, description, start_date, end_date });
    res.status(204).json(updatedChallenge);
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 수정을 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};

// 챌린지 삭제하기
export const deleteChallengeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteChallenge(id);
    res.status(204).send();
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 삭제를 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};
