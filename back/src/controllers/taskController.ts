import { Request, Response } from 'express';
import { createTask, updateTask, deleteTask } from '@_services/taskService';

// 할 일 생성하기
export const createTaskController = async (req: Request, res: Response) => {
  const { challenge_id, description } = req.body;
  try {
    const newTask = await createTask({ challenge_id, description });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('할 일 데이터를 가져오는데 실패 했습니다.:', error);
    res.status(500).send('서버 오류발생');
  }
};

// 할 일 수정하기
export const updateTaskController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, is_completed } = req.body;
  try {
    const updatedTask = await updateTask(id, { description, is_completed });
    res.status(204).json(updatedTask);
  } catch (error) {
    console.error(`${id} 아이디의 할 일을 수정을 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};

// 할 일 삭제하기
export const deleteTaskController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteTask(id);
    res.status(204).send();
  } catch (error) {
    console.error(`${id} 아이디의 할 일 삭제를 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};
