import { LocationRepository } from '@_repositories/locationRepository';
import { getMaxAQI } from '@_utils/aqi';
import type { Location } from '@_types/location';

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  public async fetchMainLocationAQI() {
    try {
      const mainLocations = await this.locationRepository.getMainLocations();
      return await Promise.all(mainLocations.map(async (location) => {
        const realtimeData = await this.locationRepository.getRealtimeData(location);
        if (realtimeData.length === 0) return { location, averageAQI: null };

        const avgAQI = realtimeData.reduce((acc, cur) => acc + getMaxAQI(cur), 0) / realtimeData.length;
        return { location, averageAQI: Math.round(avgAQI) };
      }));
    } catch (error) {
      throw new Error('Failed to calculate average AQI for main locations');
    }
  }

  public async fetchSubLocationData(location: string) {
    try {
      const [annualData, realtimeData] = await Promise.all([
        this.locationRepository.getAnnualData(location),
        this.locationRepository.getRealtimeData(location),
      ]);

      return annualData.map((annual) => {
        const realtime = realtimeData.find(r => r.location_id === annual.location_id);
        return {
          location: annual.address_b_name,
          annualMaxAQI: Math.round(getMaxAQI(annual)),
          realtimeMaxAQI: realtime ? Math.round(getMaxAQI(realtime)) : 0,
        };
      });
    } catch (error) {
      throw new Error(`Failed to retrieve annual air quality data for ${location}`);
    }
  }

  public async fetchMonthlyData(location: string, subLocation?: string) {
    try {
      return await this.locationRepository.getMonthlyData(location, subLocation ?? '');
    } catch (error) {
      throw new Error(`Failed to retrieve monthly air quality data for ${subLocation}`);
    }
  }

  // 모든 위치 데이터 로드
  public async loadAllLocations(): Promise<Location[]> {
    return await this.locationRepository.getAllLocations();
  }
}
