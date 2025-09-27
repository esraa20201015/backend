import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Experienced backend developer' })
  @IsString()
  @MaxLength(255)
  personalSummary: string;

  @ApiProperty({ example: 'NestJS, TypeScript, PostgreSQL' })
  @IsString()
  skills: string;

  @ApiProperty({ example: '3 years at TechCorp' })
  @IsString()
  experience: string;

  @ApiProperty({ example: 'B.Sc. in Computer Science' })
  @IsString()
  education: string;

  @ApiProperty({
    example: 'JVBERi0xLjUKJcTl8uXrp...',
    description: 'CV in base64 format',
    required: false,
  })
  @IsOptional()
  @IsString()
  cvFile?: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/example',
    required: false,
  })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
  userId: any;
}
