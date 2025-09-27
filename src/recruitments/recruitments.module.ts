import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';

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
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Profile, Opportunity]),
    forwardRef(() => AuthModule), // to resolve circular dependency if needed
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: config.accessTokenTtl },
      }),
    }),
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
