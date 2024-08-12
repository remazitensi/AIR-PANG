import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TaskService } from '@_services/taskService';
import { CreateTaskDto, UpdateTaskDto } from '@_dto/task.dto';
import logger from '@_utils/logger';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public createTask = async (req: Request, res: Response) => {
    const input = plainToClass(CreateTaskDto, req.body);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('Validation failed for createTask:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const newTask = await this.taskService.createTask(input);
      return res.status(201).json(newTask);
    } catch (error) {
      logger.error('Failed to create task:', { error });
      return res.status(500).send('Server error occurred');
    }
  };

  public updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const input = plainToClass(UpdateTaskDto, req.body);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('Validation failed for updateTask:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const updatedTask = await this.taskService.updateTask(id, input);
      return res.status(200).json(updatedTask);
    } catch (error) {
      logger.error(`Failed to update task with id ${id}:`, { error });
      return res.status(500).send('Server error occurred');
    }
  };

  public deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.taskService.deleteTask(id);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Failed to delete task with id ${id}:`, { error });
      return res.status(500).send('Server error occurred');
    }
  };
}
