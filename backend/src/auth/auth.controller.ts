import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/utils/auth.constants';
import { AuthService } from './auth.service';
import { LoginRequest } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() input: LoginRequest) {
    return this.authService.login(input);
  }
}
