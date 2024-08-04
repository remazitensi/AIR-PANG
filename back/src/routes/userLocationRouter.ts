import { Router } from 'express';
import {
  getUserLocations,
  addUserLocation,
  updateUserLocation,
  deleteUserLocation,
} from '@_controllers/userLocationController';

const userLocationRouter = Router();

userLocationRouter.get('/', getUserLocations);
userLocationRouter.post('/', addUserLocation);
userLocationRouter.put('/', updateUserLocation);
userLocationRouter.delete('/:id', deleteUserLocation);

export default userLocationRouter;
