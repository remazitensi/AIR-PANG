import { Router } from 'express';
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from '@_controllers/taskController';

const router = Router();

router.post('/', createTaskController);
router.patch('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;
