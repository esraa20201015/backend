import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ 
    description: 'User ID (string)',
    example: '1'
  })
  userId?: string | null;

  @ApiProperty({ 
    description: 'User avatar URL or base64 string (optional)',
    example: '',
    required: false
  })
  avatar?: string | null;

  @ApiProperty({ 
    description: 'User full name',
    example: 'John Doe'
  })
  userName?: string | null;

  @ApiProperty({ 
    description: 'User email address',
    example: 'john.doe@example.com'
  })
  email?: string | null;

  @ApiProperty({ 
    description: 'User authorities/roles array',
    example: ['candidate_user'],
    type: [String]
  })
  authority?: string[];
}

export class SignUpResponseDto {
  @ApiProperty({ 
    description: 'Success message',
    example: 'User created successfully'
  })
  message: string;

  @ApiProperty({ 
    description: 'User information',
    type: UserResponseDto,
    example: {
      userId: '1',
      avatar: '',
      userName: 'John Doe',
      email: 'john.doe@example.com',
      authority: ['candidate_user']
    }
  })
  user: UserResponseDto;

  @ApiProperty({ 
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGVzIjpbImNhbmRpZGF0ZV91c2VyIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  accessToken: string;

  @ApiProperty({ 
    description: 'JWT refresh token for token renewal',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGVzIjpbImNhbmRpZGF0ZV91c2VyIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2Mjg1NDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  refreshToken: string;
}
