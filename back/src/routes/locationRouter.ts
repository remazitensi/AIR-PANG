import { Router } from 'express';
import { getSubLocationDataController, getMonthlyDataController, getMainLocationAQIController } from '@_controllers/locationController';

const router = Router();

router.get('/', getMainLocationAQIController);         // 주요 지역 AQI
router.get('/sub', getSubLocationDataController);      // 세부 지역 AQI
router.get('/detail', getMonthlyDataController);       // 세부 지역 월별 AQI

export default router;
