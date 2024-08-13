import pool from '@_config/db.config';

export class DeleteOldDataRepository {
  public async deleteOldRealtimeData(): Promise<void> {
    const query = `
      DELETE FROM realtime_air_quality
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL 2 DAY)
    `;

    try {
      await pool.query(query);
      console.log('오래된 데이터가 삭제되었습니다.');
    } catch (err) {
      console.error('오래된 데이터 삭제 에러발생:', err);
      throw err;
    }
  }
}
