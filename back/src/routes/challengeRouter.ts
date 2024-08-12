import { Router } from 'express';
import { ChallengeController } from '@_controllers/challengeController';

const router = Router();
const challengeController = new ChallengeController();

router.get('/', challengeController.getAllChallengesController);
router.get('/:id', challengeController.getChallengeByIdController);
router.post('/', challengeController.createChallengeController);
router.patch('/:id', challengeController.updateChallengeController);
router.delete('/:id', challengeController.deleteChallengeController);

export default router;
