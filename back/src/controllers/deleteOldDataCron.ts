import cron from 'node-cron';
import { DeleteOldDataService } from '@_services/deleteOldDataService';

export class DeleteOldDataCron {
  private deleteOldDataService: DeleteOldDataService;

  constructor() {
    this.deleteOldDataService = new DeleteOldDataService();
  }

  public startCleanupJob(): void {
    cron.schedule('0 0 * * *', () => {
      this.deleteOldDataService.cleanupOldData();
    });
  }
}
