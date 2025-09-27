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
import type jwtConfigType from '../config/jwt.config'; // import type
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfigType>, // use imported type
  ) {}

  /**
   * Sign in a user and return access + refresh tokens
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

    // Generate Access Token including roles
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id.toString(), email: user.email, roles },
      {
        secret: this.jwtConfig.secret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        expiresIn: this.jwtConfig.accessTokenTtl,
      },
    );

    // Generate Refresh Token (also include roles for consistency)
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
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Hash a plain password
   */
  public async hashPassword(password: string): Promise<string> {
    return this.hashingProvider.hashPassword(password);
  }
}
