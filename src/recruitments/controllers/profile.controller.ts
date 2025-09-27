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
import { AccessTokenGuard } from 'src/auth/guards/access-token.gaurds';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Profiles') // Swagger group
@ApiBearerAuth() // JWT auth
@Controller('profiles')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Create a profile for the authenticated candidate' })
  create(
    @Body() dto: CreateProfileDto,
    @Request() req: { user: { sub: number } },
  ): Promise<Profile> {
    dto.userId = req.user.sub;
    return this.profileService.create(dto);
  }

  @Get()
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Get the authenticated candidate’s profile' })
  async findAll(@Request() req: { user: { sub: number } }): Promise<Profile[]> {
    const profile = await this.profileService.findOneByUserId(req.user.sub);
    if (!profile) return [];
    return [profile];
  }

  @Get(':id')
  @Roles('candidate_user')
  @ApiOperation({
    summary: 'Get a specific profile by ID for the authenticated candidate',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number } },
  ): Promise<Profile> {
    const profile = await this.profileService.findOne(id);
    if (!profile || profile.userId !== req.user.sub) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Put(':id')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Update the authenticated candidate’s profile' })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @Request() req: { user: { sub: number } },
  ): Promise<Profile> {
    const updatedProfile = await this.profileService.update(
      id,
      dto,
      req.user.sub,
    );
    if (!updatedProfile) throw new NotFoundException('Profile not found');
    return updatedProfile;
  }

  @Delete(':id')
  @Roles('candidate_user')
  @ApiOperation({ summary: 'Delete the authenticated candidate’s profile' })
  @ApiParam({ name: 'id', type: Number, description: 'Profile ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number } },
  ): Promise<void> {
    return this.profileService.remove(id, req.user.sub);
  }
}
