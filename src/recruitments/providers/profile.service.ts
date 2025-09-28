/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { CreateProfileDto } from '../dto/profile.dto/create.profile.dto';
import { UpdateProfileDto } from '../dto/profile.dto/update.profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  /**
   * Find profile by candidate (user) ID
   */
  async findOneByUserId(userId: number): Promise<Profile | null> {
    try {
      return await this.profileRepository.findOne({
        where: { userId },
        relations: ['applications'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch profile');
    }
  }

  async create(dto: CreateProfileDto): Promise<Profile> {
    try {
      const profile = this.profileRepository.create(dto);
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create profile');
    }
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({ relations: ['applications'] });
  }

  /**
   * Find a profile by its numeric ID
   * @param id - Profile ID (number)
   * @returns The found Profile entity
   * @throws NotFoundException if profile is not found
   */
  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['applications'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  async update(
    id: number,
    dto: UpdateProfileDto,
    userId: number,
  ): Promise<Profile> {
    const profile = await this.findOne(id);

    // Ensure user can only update their own profile
    if (profile.userId !== userId) {
      throw new NotFoundException(`Profile not found`);
    }

    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }

  async remove(id: number, userId: number): Promise<void> {
    const profile = await this.findOne(id);

    // Ensure user can only delete their own profile
    if (profile.userId !== userId) {
      throw new NotFoundException(`Profile not found`);
    }

    const result = await this.profileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
  }
}
