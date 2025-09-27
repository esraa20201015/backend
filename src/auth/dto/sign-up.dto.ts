import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRoleType {
  ADMIN = 'admin',
  RECRUITMENT_USER = 'recruitment_user',
  CANDIDATE_USER = 'candidate_user',
}

export class SignUpDto {
  @ApiProperty({ 
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Password for login (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  password: string;
  
  @ApiProperty({ 
    description: 'Full name of the user',
    example: 'John Doe'
  })
  @IsString()
  userName: string;

  @ApiProperty({ 
    description: 'Role to assign to the user',
    enum: UserRoleType,
    example: UserRoleType.ADMIN,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRoleType)
  role?: UserRoleType;
}
