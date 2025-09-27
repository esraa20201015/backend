import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'Candidate profile ID' })
  @IsNumber()
  profileId: number;

  @ApiProperty({ description: 'Opportunity ID' })
  @IsNumber()
  opportunityId: number;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
  userId: any;
}
