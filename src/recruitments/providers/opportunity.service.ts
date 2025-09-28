/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../entities/opportunity.entity';
import { CreateOpportunityDto } from '../dto/opportunity.dto/create.opportunity.dto';
import { UpdateOpportunityDto } from '../dto/opportunity.dto/update.opporunity.dto';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  async create(dto: CreateOpportunityDto): Promise<Opportunity> {
    try {
      const opportunity = this.opportunityRepository.create(dto);
      return await this.opportunityRepository.save(opportunity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create opportunity');
    }
  }

  async findAll(): Promise<Opportunity[]> {
    return this.opportunityRepository.find({ relations: ['applications'] });
  }

  async findOne(id: number): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['applications'],
    });
    if (!opportunity)
      throw new NotFoundException(`Opportunity with id ${id} not found`);
    return opportunity;
  }

  async update(id: number, dto: UpdateOpportunityDto): Promise<Opportunity> {
    try {
      const opportunity = await this.findOne(id);
      Object.assign(opportunity, dto);
      return await this.opportunityRepository.save(opportunity);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update opportunity');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.opportunityRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Opportunity with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete opportunity');
    }
  }
}
