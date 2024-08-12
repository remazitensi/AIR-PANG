import { IsString, IsBoolean, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateTaskDto {
  @IsNumber()
  @Expose()
  challenge_id!: number;

  @IsString()
  @Expose()
  description!: string;
}

export class UpdateTaskDto {
  @IsString()
  @Expose()
  description!: string;

  @IsBoolean()
  @Expose()
  is_completed!: boolean;
}
