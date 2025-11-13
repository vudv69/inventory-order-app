import { Body, Controller, Post, Res } from '@nestjs/common';
import { Public } from 'src/utils/auth.constants';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './auth.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginRequest })
  @ApiOkResponse({ type: LoginResponse })
  login(
    @Body() input: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    return this.authService.login(input);
  }
}
