/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/recruitments/providers/application.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Application } from '../entities/application.entity';
import { Profile } from '../entities/profile.entity';
import { Opportunity } from '../entities/opportunity.entity';
import { CreateApplicationDto } from '../dto/application.dto/create.application.dto';
import { CreateMultipleApplicationsDto } from '../dto/application.dto/multiple.application.dto';

@Injectable()
export class ApplicationService {
  [x: string]: any;
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,

    private readonly dataSource: DataSource,
  ) {}

  // Single application
  async apply(dto: CreateApplicationDto): Promise<Application> {
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const opportunity = await this.opportunityRepository.findOne({
      where: { id: dto.opportunityId },
    });
    if (!opportunity) throw new NotFoundException('Opportunity not found');

    return this.dataSource.transaction(async (manager) => {
      const exists = await manager.findOne(Application, {
        where: {
          profile: { id: dto.profileId },
          opportunity: { id: dto.opportunityId },
        },
      });
      if (exists)
        throw new BadRequestException('Already applied to this opportunity');

      const application = manager.create(Application, {
        profile,
        opportunity,
        status: 'pending',
      });
      return await manager.save(application);
    });
  }

  // Multiple applications
  async applyMultiple(
    dto: CreateMultipleApplicationsDto,
  ): Promise<Application[]> {
    const profile = await this.profileRepository.findOne({
      where: { id: dto.profileId },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const opportunities = await this.opportunityRepository.findByIds(
      dto.opportunityIds,
    );
    if (
      !opportunities ||
      opportunities.length !== (dto.opportunityIds?.length ?? 0)
    ) {
      throw new NotFoundException('One or more opportunities not found');
    }

    return this.dataSource.transaction(async (manager) => {
      const createdApplications: Application[] = [];

      for (const opportunity of opportunities) {
        const exists = await manager.findOne(Application, {
          where: {
            profile: { id: profile.id },
            opportunity: { id: opportunity.id },
          },
        });
        if (!exists) {
          const app = manager.create(Application, {
            profile,
            opportunity,
            status: 'pending',
          });
          createdApplications.push(await manager.save(app));
        }
      }

      return createdApplications;
    });
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find({
      relations: ['profile', 'opportunity'],
    });
  }
}
