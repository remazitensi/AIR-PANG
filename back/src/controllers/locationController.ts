import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import logger from '@_utils/logger';
import { LocationService } from '@_services/locationService';
import { GetSubLocationDataDto, GetMonthlyDataDto } from '@_dto/location.dto';

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  public getMainLocationAQIController = async (req: Request, res: Response) => {
    try {
      const results = await this.locationService.fetchMainLocationAQI();
      return res.status(200).json(results);
    } catch (error) {
      logger.error('Failed to calculate average AQI for main locations:', { error });
      return res.status(500).send('Server error occurred');
    }
  };

  public getSubLocationDataController = async (req: Request, res: Response) => {
    const input = plainToInstance(GetSubLocationDataDto, req.query);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('Validation error:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const result = await this.locationService.fetchSubLocationData(input.location);
      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Failed to retrieve annual air quality data for ${input.location}:`, { error });
      return res.status(500).send('Server error occurred');
    }
  };

  public getMonthlyDataController = async (req: Request, res: Response) => {
    const input = plainToInstance(GetMonthlyDataDto, req.query);
    const errors = await validate(input);

    if (errors.length > 0) {
      logger.warn('Validation error:', { errors });
      return res.status(400).json({ errors: errors.map(e => e.constraints) });
    }

    try {
      const detailedData = await this.locationService.fetchMonthlyData(input.location, input.subLocation);
      return res.status(200).json(detailedData);
    } catch (error) {
      logger.error(`Failed to retrieve monthly air quality data for ${input.subLocation}:`, { error });
      return res.status(500).send('Server error occurred');
    }
  };
}
