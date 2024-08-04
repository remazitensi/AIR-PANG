// index.d.ts
import { User as CustomUser } from '@_types/user'; // 사용자 정의 User 타입 import

declare global {
  namespace Express {
    interface User extends CustomUser {} // Express.User를 사용자 정의 User로 확장
  }
}
