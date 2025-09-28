/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/admins/providers/user.service';
import { SignInDto } from '../dto/signIn.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import type jwtConfigType from '../config/jwt.config';
import jwtConfig from '../config/jwt.config';
import { ROLE_PERMISSIONS } from '../constants/roles.constant';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfigType>,
  ) {}

  /**
   * Sign in a user and return access + refresh tokens with roles and permissions
   */
  public async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordMatches = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid email or password');

    // Example: hash password internally (optional usage)
    const hashedPassword = await this.hashPassword(signInDto.password);
    console.log('Hashed password (for debugging):', hashedPassword);

    // Resolve roles for token payload
    const roles = Array.isArray(user.userRoles)
      ? user.userRoles.map((ur) => ur?.role?.name).filter(Boolean)
      : [];

    // Get all permissions for user's roles
    const permissions = this.getUserPermissions(roles);

    // Enhanced token payload with user context
    const tokenPayload = {
      sub: user.id.toString(),
      email: user.email,
      roles,
      permissions,
      userId: user.id,
      companyId: user.company?.id,
      departmentId: user.department?.id,
    };

    // Generate Access Token including roles and permissions
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.jwtConfig.secret,
      audience: this.jwtConfig.audience,
      issuer: this.jwtConfig.issuer,
      expiresIn: this.jwtConfig.accessTokenTtl,
    });

    // Generate Refresh Token (also include roles for consistency)
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.jwtConfig.refreshSecret,
      audience: this.jwtConfig.audience,
      issuer: this.jwtConfig.issuer,
      expiresIn: this.jwtConfig.refreshTokenTtl,
    });

    return {
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
        company: user.company,
        department: user.department,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get all permissions for user's roles
   */
  private getUserPermissions(roles: string[]): string[] {
    const allPermissions = new Set<string>();
    
    roles.forEach(role => {
      const rolePermissions = ROLE_PERMISSIONS[role] || [];
      rolePermissions.forEach(permission => allPermissions.add(permission));
    });
    
    return Array.from(allPermissions);
  }

  /**
   * Hash a plain password
   */
  public async hashPassword(password: string): Promise<string> {
    return this.hashingProvider.hashPassword(password);
  }
}
