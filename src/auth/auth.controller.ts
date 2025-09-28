import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { RefreshTokenDto } from './dto/refresh-toekn.dto';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
@ApiTags('Authentication')
@Controller('auth')
// No @UseGuards() - Auth endpoints are public
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('sign-up')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account and returns authentication tokens'
  })
  signUp(@Body() dto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOperation({ 
    summary: 'Authenticate user and get tokens',
    description: 'Signs in a user with email and password, returns user info and authentication tokens'
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  @ApiOperation({ 
    summary: 'Sign out user',
    description: 'Signs out the current user (client should discard tokens)'
  })
  signOut() {
    return this.authService.signOut();
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Uses refresh token to get a new access token'
  })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
