// src/recruitments/controllers/opportunity.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OpportunityService } from '../providers/opportunity.service';
import { Opportunity } from '../entities/opportunity.entity';
import { CreateOpportunityDto } from '../dto/opportunity.dto/create.opportunity.dto';
import { UpdateOpportunityDto } from '../dto/opportunity.dto/update.opporunity.dto';

// Auth Guards
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Opportunities')
@ApiBearerAuth()
@Controller('opportunities')
@UseGuards(AccessTokenGuard, RolesGuard) // Add guards here
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @Roles('recruitment_user', 'admin')
  @ApiOperation({ 
    summary: 'Create a new job opportunity',
    description: 'Recruiters and admins can create job opportunities'
  })
  async create(@Body() dto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunityService.create(dto);
  }

  @Get()
  @Roles('recruitment_user', 'admin', 'candidate_user')
  @ApiOperation({ 
    summary: 'Get all job opportunities',
    description: 'All authenticated users can view opportunities'
  })
  async findAll(): Promise<Opportunity[]> {
    return this.opportunityService.findAll();
  }

  @Get(':id')
  @Roles('recruitment_user', 'admin', 'candidate_user')
  @ApiOperation({ 
    summary: 'Get a specific job opportunity by ID',
    description: 'All authenticated users can view specific opportunities'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Opportunity ID' })
  async findOne(@Param('id') id: string): Promise<Opportunity> {
    return this.opportunityService.findOne(+id);
  }

  @Patch(':id')
  @Roles('recruitment_user', 'admin')
  @ApiOperation({ 
    summary: 'Update a job opportunity',
    description: 'Recruiters and admins can update opportunities'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Opportunity ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ): Promise<Opportunity> {
    return this.opportunityService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('recruitment_user', 'admin')
  @ApiOperation({ 
    summary: 'Delete a job opportunity',
    description: 'Recruiters and admins can delete opportunities'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Opportunity ID' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.opportunityService.remove(+id);
  }
}
