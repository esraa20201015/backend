import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './admins/admins.module';
import { RecruitmentsModule } from './recruitments/recruitments.module';
import { AuthModule } from './auth/auth.module';

// Admin entities
import { Category } from './admins/entities/category.entity';
import { Company } from './admins/entities/company.entity';
import { Department } from './admins/entities/department.entity';
import { User } from './admins/entities/user.entity';
import { Role } from './admins/entities/role.entity';
import { Privilege } from './admins/entities/privilege.entity';
import { UserRole } from './admins/entities/user-role.entity';
import { LookupMaster } from './admins/entities/lookup-master.entity';
import { LookupDetail } from './admins/entities/lookup-detail.entity';

// Recruitment entities
import { Profile } from './recruitments/entities/profile.entity';
import { Opportunity } from './recruitments/entities/opportunity.entity';
import { Application } from './recruitments/entities/application.entity';

// Configs
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './auth/config/jwt.config';
import authConfig from './auth/config/auth.config';
import environmentValidationConfig from './config/environment.validation.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, jwtConfig, authConfig],
      validationSchema: environmentValidationConfig,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [
          // Admin entities
          Category,
          Company,
          Department,
          User,
          Role,
          Privilege,
          UserRole,
          LookupMaster,
          LookupDetail,
          // Recruitment entities
          Profile,
          Opportunity,
          Application,
        ],
        synchronize: true,
        // logging: true,
        autoLoadEntities: true,
        ssl: { rejectUnauthorized: false },
      }),
    }),

    AdminsModule,
    RecruitmentsModule,
    AuthModule,
  ],
})
export class AppModule {}
