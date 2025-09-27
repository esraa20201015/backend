import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateMultipleApplicationsDto {
  @ApiProperty({ description: 'Profile ID of the candidate' })
  @IsInt()
  profileId: number;

  @ApiProperty({
    description: 'List of opportunity IDs to apply for',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  opportunityIds: number[];
  userId: any;
}
