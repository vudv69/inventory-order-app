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
  async login(
    @Body() input: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const response = await this.authService.login(input);

    res.cookie('access_token', response.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1h
      path: '/',
    });

    return response;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out' };
  }
}
