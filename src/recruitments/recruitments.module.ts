import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from './entities/application.entity';
import { Profile } from './entities/profile.entity';
import { Opportunity } from './entities/opportunity.entity';

import { ApplicationService } from './providers/application.service';
import { ProfileService } from './providers/profile.service';
import { OpportunityService } from './providers/opportunity.service';

import { ApplicationController } from './controllers/application.controller';
import { ProfileController } from './controllers/profile.controller';
import { OpportunityController } from './controllers/opportunity.controller';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Profile, Opportunity]),
    forwardRef(() => AuthModule), // to resolve circular dependency if needed
    // Remove duplicate JWT configuration - it's available globally from AuthModule
  ],
  controllers: [
    ApplicationController,
    ProfileController,
    OpportunityController,
  ],
  providers: [ApplicationService, ProfileService, OpportunityService],
  exports: [ApplicationService, ProfileService, OpportunityService],
})
export class RecruitmentsModule {}
