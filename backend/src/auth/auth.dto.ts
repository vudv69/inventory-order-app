import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class LoginResponse {
  username: string;
  role: string;
  accessToken: string;
}
