import { Router } from 'express';
import { getLocationDataController, getMonthlyDataController } from '@_controllers/locationController';

const router = Router();

router.get('/', getLocationDataController);
router.get('/detail', getMonthlyDataController);

export default router;
