/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { UserService } from 'src/admins/providers/user.service';
import { RoleService } from 'src/admins/providers/role.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignUpResponseDto } from '../dto/sign-up-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly signInProvider: SignInProvider,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<
      typeof import('../config/jwt.config').default
    >,
  ) {}

  // ------------------------
  // Sign up a new candidate user
  // ------------------------
  public async signUp(dto: SignUpDto): Promise<SignUpResponseDto> {
    const existingUser = await this.userService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await this.signInProvider.hashPassword(dto.password);

    // Create user
    const user = await this.userService.create({
      email: dto.email,
      fullName: dto.userName, // Map userName to fullName for database
      password: hashedPassword,
    });

    // Try to assign candidate_user role if it exists
    try {
      const candidateRole = await this.roleService.findByName('candidate_user');
      if (candidateRole) {
        await this.userService.assignRole(user.id, candidateRole.name);
      }
    } catch (error) {
      console.warn('candidate_user role not found or assignment failed:', error.message);
      // Continue without role assignment - user can be assigned roles later via admin interface
    }

    // Fetch user with roles for response
    const userWithRoles = await this.userService.findOne(user.id);
    const roles = Array.isArray(userWithRoles.userRoles)
      ? userWithRoles.userRoles.map((ur) => ur?.role?.name).filter(Boolean)
      : [];

    // Generate tokens for the new user including roles
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id.toString(), email: user.email, roles },
      {
        secret: this.jwtConfig.secret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        expiresIn: this.jwtConfig.accessTokenTtl,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id.toString(), email: user.email, roles },
      {
        secret: this.jwtConfig.refreshSecret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        expiresIn: this.jwtConfig.refreshTokenTtl,
      },
    );

    return {
      message: 'User created successfully',
      user: {
        userId: user.id?.toString(),
        avatar: user.userImg ?? '',
        userName: user.fullName,
        email: user.email,
        authority: roles,
      },
      accessToken,
      refreshToken,
    };
  }

  // Sign in
  public async signIn(signInDto: SignInDto) {
    const signInResult = await this.signInProvider.signIn(signInDto);

    if (!signInResult?.accessToken || !signInResult?.refreshToken)
      throw new UnauthorizedException('Invalid credentials');

    const user = await this.userService.findOne(signInResult.userId);

    const roles = Array.isArray(user.userRoles)
      ? user.userRoles.map((ur) => ur?.role?.name).filter(Boolean)
      : [];

    return {
      user: {
        userId: user.id?.toString(),
        avatar: user.userImg ?? '',
        userName: user.fullName,
        email: user.email,
        authority: roles,
      },
      accessToken: signInResult.accessToken,
      refreshToken: signInResult.refreshToken,
    };
  }

  // Sign out
  public signOut() {
    return { message: 'Signed out successfully' };
  }

  // Refresh token
  public async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
      });

      if (!payload?.sub) throw new UnauthorizedException('Invalid token');

      const user = await this.userService.findOne(payload.sub.toString());
      if (!user) throw new UnauthorizedException('User not found');

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          roles: Array.isArray(user.userRoles)
            ? user.userRoles.map((ur) => ur?.role?.name).filter(Boolean)
            : [],
        },
        {
          secret: this.jwtConfig.secret,
          audience: this.jwtConfig.audience,
          issuer: this.jwtConfig.issuer,
          expiresIn: this.jwtConfig.accessTokenTtl,
        },
      );

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roles: Array.isArray(user.userRoles)
            ? user.userRoles.map((ur) => ur?.role?.name).filter(Boolean)
            : [],
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
