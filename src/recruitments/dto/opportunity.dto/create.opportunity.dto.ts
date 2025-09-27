import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum PublishScope {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export class CreateOpportunityDto {
  @ApiProperty({ description: 'Job title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Job description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Job type', enum: JobType })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ description: 'Salary range', required: false })
  @IsOptional()
  @IsString()
  salaryRange?: string;

  @ApiProperty({ description: 'Department ID' })
  @IsNumber()
  departmentId: number;

  @ApiProperty({ description: 'Publish scope', enum: PublishScope })
  @IsEnum(PublishScope)
  publishScope: PublishScope;
}
