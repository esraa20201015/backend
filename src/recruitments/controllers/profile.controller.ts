/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProfileService } from '../providers/profile.service';
import { Profile } from '../entities/profile.entity';
import { CreateProfileDto } from '../dto/profile.dto/create.profile.dto';
import { UpdateProfileDto } from '../dto/profile.dto/update.profile.dto';

// Auth Guards
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(AccessTokenGuard, RolesGuard) // Add guards here
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Create candidate profile (Candidates only)' })
  async create(@Body() dto: CreateProfileDto, @Request() req): Promise<Profile> {
    dto.userId = req.user.sub; // Get user ID from token
    return this.profileService.create(dto);
  }

  @Get()
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Get own profile (Candidates only)' })
  @Get('me')
  @Roles('candidate_user')
  async findOwn(@Request() req): Promise<Profile> {
    const profile = await this.profileService.findOneByUserId(req.user.sub);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Get(':id')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Get profile by ID (Candidates only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  async findOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Update own profile (Candidates only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Request() req,
  ): Promise<Profile> {
    return this.profileService.update(+id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Delete own profile (Candidates only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.profileService.remove(+id, req.user.sub);
  }
}
