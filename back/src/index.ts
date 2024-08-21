import app from './app';
import { config } from '@_config/env.config';
import logger from '@_utils/logger'; 

const port = config.PORT;

// 포트 값이 정의되지 않은 경우, 오류를 발생
if (port === undefined) {
  logger.error('Error: PORT is not defined in the configuration.');
  process.exit(1); // 프로세스 종료
}

// 서버 시작
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
