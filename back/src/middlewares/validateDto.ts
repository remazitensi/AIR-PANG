import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '@_utils/customError';
import logger from '@_utils/logger';

export const validateDto = async <T extends object>(dtoClass: new () => T, data: object): Promise<void> => {
  const dto = plainToInstance(dtoClass, data);
  const errors = await validate(dto);

  if (errors.length > 0) {
    logger.warn('Validation failed:', {validationErrors: errors.map(e => e.constraints)});
    throw new ValidationError(errors);
  }
};

