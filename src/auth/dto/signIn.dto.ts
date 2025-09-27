import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignInDto {
  @ApiProperty({ 
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  
  @ApiProperty({ 
    description: 'Password for login',
    example: 'SecurePass123!'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  
  @ApiPropertyOptional({ 
    description: 'User ID (optional)',
    example: '1'
  })
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;
}
