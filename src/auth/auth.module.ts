/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

import { AuthService } from './providers/auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';

import { JwtStrategy } from './strategies/jwt.service';
import { AccessTokenGuard } from './guards/access-token.gaurds';
import { RolesGuard } from './guards/roles.guards';
import { ScopedAccessGuard } from './guards/scoped-access.guard';

import { AuthController } from './auth.controller'; 
import { AdminsModule } from '../admins/admins.module';

@Global() // Add @Global() decorator
@Module({
  imports: [
    forwardRef(() => AdminsModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.secret,
        signOptions: { expiresIn: jwtConfiguration.accessTokenTtl },
      }),
    }),
  ],
  controllers: [AuthController], 
  providers: [
    AuthService,
    SignInProvider,
    JwtStrategy,
    AccessTokenGuard,
    RolesGuard,
    ScopedAccessGuard,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [
    AuthService,
    SignInProvider,
    AccessTokenGuard,
    RolesGuard,
    ScopedAccessGuard,
    JwtModule,
  ],
})
export class AuthModule {}
