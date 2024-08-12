import { Router } from 'express';
import { TaskController } from '@_controllers/taskController';

const router = Router();
const taskController = new TaskController();

router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
