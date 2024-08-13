import { DeleteOldDataRepository } from '@_repositories/deleteOldDataRepository';

export class DeleteOldDataService {
  private deleteOldDataRepository: DeleteOldDataRepository;

  constructor() {
    this.deleteOldDataRepository = new DeleteOldDataRepository();
  }

  public async cleanupOldData(): Promise<void> {
    return this.deleteOldDataRepository.deleteOldRealtimeData();
  }
}
