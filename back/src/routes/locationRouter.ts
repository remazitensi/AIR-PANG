import { Router } from 'express';
import { LocationController } from '@_controllers/locationController';

const router = Router();
const locationController = new LocationController();

router.get('/', locationController.getMainLocationAQIController);    // 주요 지역 AQI
router.get('/sub', locationController.getSubLocationDataController); // 세부 지역 AQI
router.get('/detail', locationController.getMonthlyDataController);  // 세부 지역 월별 AQI

export default router;
