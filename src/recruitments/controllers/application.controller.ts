/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationService } from '../providers/application.service';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/application.dto/create.application.dto';
import { UpdateApplicationDto } from '../dto/application.dto/update.profile.dto';
import { CreateMultipleApplicationsDto } from '../dto/application.dto/multiple.application.dto';

// Enhanced Auth Guards
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ScopedAccessGuard } from 'src/auth/guards/scoped-access.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../../auth/constants/roles.constant';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply')
  @Roles('candidate_user')
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

  @Get(':id')
  @Roles('recruitment_user', 'admin', 'hr_user', 'candidate_user')
  @Permissions(PERMISSIONS.MANAGE_APPLICATIONS, PERMISSIONS.VIEW_OWN_APPLICATIONS)
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Application ID' })
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  @Roles('recruitment_user', 'admin', 'hr_user')
  @Permissions(PERMISSIONS.MANAGE_APPLICATIONS)
  @ApiOperation({ summary: 'Update application status (Recruiters, Admin, HR)' })
  @ApiParam({ name: 'id', type: Number, description: 'Application ID' })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req,
  ): Promise<Application> {
    return this.applicationService.update(+id, updateApplicationDto, req.user);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions(PERMISSIONS.MANAGE_APPLICATIONS)
  @ApiOperation({ summary: 'Delete application (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Application ID' })
  remove(@Param('id') id: string,
   @Request() req): Promise<void> {
    return this.applicationService.remove(+id, req.user);
  }
}
