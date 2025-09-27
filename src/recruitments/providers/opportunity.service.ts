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
}
