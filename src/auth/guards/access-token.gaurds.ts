/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Inject,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import type { ConfigType } from '@nestjs/config';
  import jwtConfig from '../config/jwt.config';
  
  @Injectable()
  export class AccessTokenGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      @Inject(jwtConfig.KEY) // use Inject here
      private readonly jwtConf: ConfigType<typeof jwtConfig>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers['authorization'];
      if (!authHeader) throw new UnauthorizedException('Access token missing');
  
      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer' || !token)
        throw new UnauthorizedException('Invalid token');
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.jwtConf.secret,
          audience: this.jwtConf.audience,
          issuer: this.jwtConf.issuer,
        });
        request['user'] = payload; // attach user info to request
        return true;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  