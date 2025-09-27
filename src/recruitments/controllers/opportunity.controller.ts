// src/recruitments/controllers/opportunity.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiParam, 
  ApiResponse, 
  ApiBody,
  ApiSecurity 
} from '@nestjs/swagger';
import { OpportunityService } from '../providers/opportunity.service';
import { Opportunity } from '../entities/opportunity.entity';
import { CreateOpportunityDto } from '../dto/opportunity.dto/create.opportunity.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Opportunities')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@Controller('opportunities')
@UseGuards(AccessTokenGuard, RolesGuard)
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @Roles('recruitment_user', 'admin')
  @ApiOperation({ 
    summary: 'Create a new job opportunity',
    description: 'Creates a new job opportunity. Requires recruitment_user or admin role.'
  })
  @ApiBody({
    type: CreateOpportunityDto,
    examples: {
      softwareEngineer: {
        summary: 'Software Engineer Position',
        description: 'Create a software engineer job opportunity',
        value: {
          title: 'Senior Software Engineer',
          description: 'We are looking for an experienced software engineer to join our team.',
          requirements: '5+ years experience, React, Node.js, TypeScript',
          location: 'Remote',
          salary: 120000,
          type: 'full-time',
          status: 'active'
        }
      },
      marketingManager: {
        summary: 'Marketing Manager Position',
        description: 'Create a marketing manager job opportunity',
        value: {
          title: 'Marketing Manager',
          description: 'Lead our marketing initiatives and campaigns.',
          requirements: '3+ years marketing experience, digital marketing skills',
          location: 'New York, NY',
          salary: 80000,
          type: 'full-time',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Opportunity created successfully',
    type: Opportunity,
    examples: {
      success: {
        summary: 'Opportunity Created',
        value: {
          id: 1,
          title: 'Senior Software Engineer',
          description: 'We are looking for an experienced software engineer to join our team.',
          requirements: '5+ years experience, React, Node.js, TypeScript',
          location: 'Remote',
          salary: 120000,
          type: 'full-time',
          status: 'active',
          generated_date: '2024-01-15T10:30:00Z',
          last_updated_date: '2024-01-15T10:30:00Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation errors',
    examples: {
      validationError: {
        summary: 'Validation Error',
        value: {
          statusCode: 400,
          message: ['Title is required', 'Description must be at least 10 characters'],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token',
    examples: {
      unauthorized: {
        summary: 'Unauthorized',
        value: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - insufficient permissions',
    examples: {
      forbidden: {
        summary: 'Insufficient Permissions',
        value: {
          statusCode: 403,
          message: 'Insufficient permissions',
          error: 'Forbidden'
        }
      }
    }
  })
  create(@Body() dto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunityService.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all job opportunities',
    description: 'Retrieves a list of all job opportunities. Available to all authenticated users.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of opportunities retrieved successfully',
    type: [Opportunity],
    examples: {
      success: {
        summary: 'Opportunities List',
        value: [
          {
            id: 1,
            title: 'Senior Software Engineer',
            description: 'We are looking for an experienced software engineer to join our team.',
            requirements: '5+ years experience, React, Node.js, TypeScript',
            location: 'Remote',
            salary: 120000,
            type: 'full-time',
            status: 'active',
            generated_date: '2024-01-15T10:30:00Z',
            last_updated_date: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            title: 'Marketing Manager',
            description: 'Lead our marketing initiatives and campaigns.',
            requirements: '3+ years marketing experience, digital marketing skills',
            location: 'New York, NY',
            salary: 80000,
            type: 'full-time',
            status: 'active',
            generated_date: '2024-01-16T09:15:00Z',
            last_updated_date: '2024-01-16T09:15:00Z'
          }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token'
  })
  findAll(): Promise<Opportunity[]> {
    return this.opportunityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a specific job opportunity by ID',
    description: 'Retrieves a single job opportunity by its ID. Available to all authenticated users.'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Unique identifier of the opportunity',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Opportunity retrieved successfully',
    type: Opportunity,
    examples: {
      success: {
        summary: 'Opportunity Details',
        value: {
          id: 1,
          title: 'Senior Software Engineer',
          description: 'We are looking for an experienced software engineer to join our team.',
          requirements: '5+ years experience, React, Node.js, TypeScript',
          location: 'Remote',
          salary: 120000,
          type: 'full-time',
          status: 'active',
          generated_date: '2024-01-15T10:30:00Z',
          last_updated_date: '2024-01-15T10:30:00Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Opportunity not found',
    examples: {
      notFound: {
        summary: 'Opportunity Not Found',
        value: {
          statusCode: 404,
          message: 'Opportunity with id 999 not found',
          error: 'Not Found'
        }
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Opportunity> {
    return this.opportunityService.findOne(id);
  }
}
