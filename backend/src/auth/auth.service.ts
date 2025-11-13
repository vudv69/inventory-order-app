import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from 'src/auth/auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException(`Not found email=${input.email}`);
    }

    const isMatching = await bcrypt.compare(input.password, user.password);

    if (!isMatching) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: token,
    };
  }
}
