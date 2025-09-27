import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SignOutDto {
  @ApiPropertyOptional({ description: 'User ID must be a string' })
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
  @ApiPropertyOptional({ description: 'Access token must be a string' })
  @IsOptional()
  @IsString({ message: 'Access token must be a string' })
  accessToken?: string;
}
