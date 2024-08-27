import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateDto } from '@_middlewares/validateDto';
import { TaskService } from '@_services/taskService';
import { CreateTaskDto, UpdateTaskDto } from '@_dto/task.dto';
import logger from '@_utils/logger';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  // Task 생성
  public createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createTaskDto = plainToInstance(CreateTaskDto, req.body);
      await validateDto(CreateTaskDto, createTaskDto);

      const newTask = await this.taskService.createTask(createTaskDto);
      return res.status(201).json(newTask);
    } catch (error) {
      logger.error('Failed to create task:', { error });
      next(error);
    }
  };

  // Task 업데이트
  public updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const updateTaskDto = plainToInstance(UpdateTaskDto, req.body);
      await validateDto(UpdateTaskDto, updateTaskDto);

      const updatedTask = await this.taskService.updateTask(id, updateTaskDto);
      return res.status(200).json(updatedTask);
    } catch (error) {
      logger.error(`Failed to update task with id ${id}:`, { error });
      next(error);
    }
  };

  // Task 삭제
  public deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await this.taskService.deleteTask(id);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Failed to delete task with id ${id}:`, { error });
      next(error);
    }
  };
}
