import { IsString, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Task } from '@_types/challenge';

export class CreateTaskDto {
  @IsString()
  @Expose()
  description!: string;

  @IsOptional()
  @Expose()
  is_completed?: boolean;
}

export class CreateChallengeDto {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsDateString()
  @Expose()
  start_date!: string;

  @IsDateString()
  @Expose()
  end_date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  @Expose()
  tasks!: CreateTaskDto[];
}

export class UpdateChallengeDto {
  @IsString()
  @Expose()
  title!: string;

  @IsString()
  @Expose()
  description!: string;

  @IsDateString()
  @Expose()
  start_date!: string;

  @IsDateString()
  @Expose()
  end_date!: string;
}
