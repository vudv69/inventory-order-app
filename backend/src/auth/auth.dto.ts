import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class LoginResponse {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'USER or MANAGER' })
  role: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}
