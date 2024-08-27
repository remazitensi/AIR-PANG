import { IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class GetSubLocationDataDto {
  @IsString({ message: 'location 필드는 문자열이어야 합니다.' })
  @Expose()
  location!: string;
}

export class GetMonthlyDataDto {
  @IsString({ message: 'location 필드는 문자열이어야 합니다.' })
  @Expose()
  location!: string;

  @IsOptional()
  @IsString({ message: 'subLocation 필드가 존재할 경우, 문자열이어야 합니다.' })
  @Expose()
  subLocation?: string;
}
