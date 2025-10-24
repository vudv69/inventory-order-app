import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from 'src/auth/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByUsername(input.username);

    if (!user) {
      throw new UnauthorizedException(`Not found username=${input.username}`);
    }

    const payload = {
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      username: user.username,
      role: user.role,
      accessToken: token,
    };
  }
}
