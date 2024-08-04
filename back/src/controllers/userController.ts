import { Request, Response } from 'express';
import { UserService } from '@_services/userService';

// UserService 인스턴스 생성
const userService = new UserService();

// 사용자 마이페이지 정보 및 참여중인 환경 챌린지 목록 조회
export const getUserInfo = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const { userLocations, challenges } = await userService.getUserProfileAndChallenges(userId);
    res.json({ userLocations, challenges });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 관심지역 페이지 조회
export const searchLocations = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  try {
    const locations = await userService.searchLocations(query);
    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 사용자 정보 수정
export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUser(userId, updateData);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
