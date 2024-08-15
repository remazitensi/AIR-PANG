import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleUserDto {
  @IsNotEmpty()
  @IsString()
  googleId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  googleAccessToken!: string;

  @IsNotEmpty()
  @IsString()
  googleRefreshToken!: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
