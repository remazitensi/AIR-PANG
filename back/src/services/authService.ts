import { AuthRepository } from '@_repositories/authRepository';
import { User } from '@_types/user';
import logger from '@_utils/logger';

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  // 구글 ID로 사용자 조회
  async findUser(googleId: string): Promise<User | null> {
    try {
      const user = await this.authRepository.findUserByGoogleId(googleId);
      return user;
    } catch (error) {
      logger.error('Error in findUser:', error);
      throw new Error('Error occurred while retrieving user.');
    }
  }

  // 사용자 ID로 사용자 조회
  async findUserById(id: number): Promise<User | null> {
    try {
      const user = await this.authRepository.findUserById(id);
      return user;
    } catch (error) {
      logger.error('Error in findUserById:', error);
      throw new Error('Error occurred while retrieving user by ID.');
    }
  }

  // 구글 사용자 생성
  async createUser(googleUser: {
    googleId: string;
    name: string;
    googleAccessToken: string;
    googleRefreshToken: string;
  }): Promise<User> {
    try {
      const user = await this.authRepository.createUser(googleUser);
      return user;
    } catch (error) {
      logger.error('Error in createUser:', error);
      throw new Error('Error occurred while creating user.');
    }
  }

  // 사용자 리프레시 토큰 저장
  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      await this.authRepository.saveRefreshToken(userId, refreshToken);
    } catch (error) {
      logger.error('Error in saveRefreshToken:', error);
      throw new Error('Error occurred while saving refresh token.');
    }
  }
}
