import pool from '@_config/db.config';
import logger from '@_utils/logger';  // winston 로거 가져오기

export class DeleteOldDataRepository {
  public async deleteOldRealtimeData(): Promise<void> {
    const query = `
      DELETE FROM realtime_air_quality
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL 2 DAY)
    `;

    try {
      await pool.query(query);
      logger.info('Old real-time data has been deleted successfully.');
    } catch (err) {
      logger.error('Error occurred while deleting old real-time data:', err);
      throw err;
    }
  }
}
