/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationService } from '../providers/application.service';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/application.dto/create.application.dto';
import { CreateMultipleApplicationsDto } from '../dto/application.dto/multiple.application.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Applications') // Swagger group
@ApiBearerAuth() // Show JWT auth
@Controller('applications')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply')
  @Roles('candidate_user') // Only candidates can apply
  @ApiOperation({ summary: 'Apply to a single opportunity' })
  apply(
    @Body() dto: CreateApplicationDto,
    @Request() req,
  ): Promise<Application> {
    dto.userId = req.user.sub; // Assign candidate id from token
    return this.applicationService.apply(dto);
  }

  @Post('apply-multiple')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Apply to multiple opportunities at once' })
  applyMultiple(
    @Body() dto: CreateMultipleApplicationsDto,
    @Request() req,
  ): Promise<Application[]> {
    dto.userId = req.user.sub;
    return this.applicationService.applyMultiple(dto);
  }

  @Get()
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Get all applications of the logged-in candidate' })
  findAll(@Request() req): Promise<Application[]> {
    return this.applicationService.findByUserId(req.user.sub);
  }
}
