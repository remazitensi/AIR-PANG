import { Request, Response } from 'express';
import { UserLocationService } from '@_services/userLocationService';

const userLocationService = new UserLocationService();

// 관심지역 조회
export const getUserLocations = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const userLocations = await userLocationService.getUserLocations(userId);
    res.json(userLocations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 관심지역 추가
export const addUserLocation = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { location_id } = req.body;

  try {
    const newUserLocation = await userLocationService.addUserLocation(userId, location_id);
    res.status(201).json(newUserLocation);
  } catch (error) {
    console.error('Error adding user location:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 관심지역 수정
export const updateUserLocation = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { id, location_id } = req.body;

  try {
    const updatedUserLocation = await userLocationService.updateUserLocation(userId, id, location_id);
    res.json(updatedUserLocation);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 관심지역 삭제
export const deleteUserLocation = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { id } = req.body;

  try {
    await userLocationService.deleteUserLocation(userId, id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user location:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
