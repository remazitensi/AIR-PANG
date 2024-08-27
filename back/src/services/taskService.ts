import { TaskRepository } from '@_repositories/taskRepository';
import { CreateTaskDto, UpdateTaskDto } from '@_dto/task.dto';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async createTask(input: CreateTaskDto) {
    try {
      return await this.taskRepository.createTask(input);
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  public async updateTask(id: string, input: UpdateTaskDto) {
    try {
      return await this.taskRepository.updateTask(id, input);
    } catch (error) {
      throw new Error(`Failed to update task with id: ${id}`);
    }
  }

  public async deleteTask(id: string) {
    try {
      await this.taskRepository.deleteTask(id);
    } catch (error) {
      throw new Error(`Failed to delete task with id: ${id}`);
    }
  }
}
