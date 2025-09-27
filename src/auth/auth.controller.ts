import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { RefreshTokenDto } from './dto/refresh-toekn.dto';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('sign-up')
  @ApiOperation({ 
    summary: 'Register a new candidate user',
    description: 'Creates a new user account with candidate_user role and returns authentication tokens'
  })
  @ApiBody({
    type: SignUpDto,
    examples: {
      candidate: {
        summary: 'Candidate Registration',
        description: 'Register a new candidate user',
        value: {
          userName: 'John Doe',
          email: 'john.doe@example.com',
          password: 'SecurePass123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully with authentication tokens',
    type: SignUpResponseDto,
    examples: {
      success: {
        summary: 'Successful Registration',
        value: {
          message: 'User created successfully',
          user: {
            userId: '1',
            avatar: '',
            userName: 'John Doe',
            email: 'john.doe@example.com',
            authority: ['candidate_user']
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation errors',
    examples: {
      validationError: {
        summary: 'Validation Error',
        value: {
          statusCode: 400,
          message: ['Email must be a valid email address', 'Password must be at least 8 characters'],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Email already exists',
    examples: {
      emailExists: {
        summary: 'Email Already Exists',
        value: {
          statusCode: 401,
          message: 'Email already exists',
          error: 'Unauthorized'
        }
      }
    }
  })
  signUp(@Body() dto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOperation({ 
    summary: 'Authenticate user and get tokens',
    description: 'Signs in a user with email and password, returns user info and authentication tokens'
  })
  @ApiBody({
    type: SignInDto,
    examples: {
      candidate: {
        summary: 'Candidate Sign In',
        description: 'Sign in as a candidate user',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!'
        }
      },
      admin: {
        summary: 'Admin Sign In',
        description: 'Sign in as an admin user',
        value: {
          email: 'admin@company.com',
          password: 'AdminPass123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User signed in successfully',
    examples: {
      candidate: {
        summary: 'Candidate Sign In Success',
        value: {
          user: {
            userId: '1',
            avatar: '',
            userName: 'John Doe',
            email: 'john.doe@example.com',
            authority: ['candidate_user']
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      admin: {
        summary: 'Admin Sign In Success',
        value: {
          user: {
            userId: '2',
            avatar: '',
            userName: 'Admin User',
            email: 'admin@company.com',
            authority: ['admin']
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    examples: {
      invalidCredentials: {
        summary: 'Invalid Credentials',
        value: {
          statusCode: 401,
          message: 'Invalid email or password',
          error: 'Unauthorized'
        }
      }
    }
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  @ApiOperation({ 
    summary: 'Sign out user',
    description: 'Signs out the current user (client should discard tokens)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User signed out successfully',
    examples: {
      success: {
        summary: 'Sign Out Success',
        value: {
          message: 'Signed out successfully'
        }
      }
    }
  })
  signOut() {
    return this.authService.signOut();
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Uses refresh token to get a new access token'
  })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      refresh: {
        summary: 'Refresh Token',
        description: 'Refresh access token using refresh token',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    examples: {
      success: {
        summary: 'Token Refresh Success',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'john.doe@example.com',
            fullName: 'John Doe',
            roles: ['candidate_user']
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired refresh token',
    examples: {
      invalidToken: {
        summary: 'Invalid Refresh Token',
        value: {
          statusCode: 401,
          message: 'Invalid or expired refresh token',
          error: 'Unauthorized'
        }
      }
    }
  })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
