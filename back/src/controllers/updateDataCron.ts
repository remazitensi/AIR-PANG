import cron from 'node-cron';
import { UpdateDataService } from '@_services/updateDataService';

export class UpdateDataCron {
  private updateDataService: UpdateDataService;

  constructor() {
    this.updateDataService = new UpdateDataService();
  }

  public startCronJob(): void {
    cron.schedule('0 */24 * * *', () => {
      this.updateDataService.fetchAndStoreData();
    });

    // 서버 시작 시 한번 실행 (테스트 할 땐 주석처리)
    // this.updateDataService.fetchAndStoreData();
  }
}
