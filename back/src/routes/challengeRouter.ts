import { Router } from 'express';
import {
  getAllChallengesController,
  getChallengeByIdController,
  createChallengeController,
  updateChallengeController,
  deleteChallengeController,
} from '@_controllers/challengeController';

const router = Router();

router.get('/', getAllChallengesController);
router.get('/:id', getChallengeByIdController);
router.post('/', createChallengeController);
router.patch('/:id', updateChallengeController);
router.delete('/:id', deleteChallengeController);

export default router;
