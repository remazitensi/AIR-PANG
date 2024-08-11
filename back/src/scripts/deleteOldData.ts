import cron from 'node-cron';
import pool from '@_config/db.config';

// 2일 간격으로 오래된 데이터 삭제하는 함수
export const deleteOldData = async () => {
  const query = `
    DELETE FROM realtime_air_quality
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL 2 DAY)
  `;

  try {
    await pool.query(query);
    console.log('오래된 데이터가 삭제되었습니다.');
  } catch (err) {
    console.error('오래된 데이터 삭제 에러발생:', err);
  }
};

export const startCleanupJob = () => {
  // 매일 자정에 실행
  cron.schedule('0 0 * * *', deleteOldData);
};
