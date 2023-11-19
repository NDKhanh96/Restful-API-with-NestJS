import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() authDto: AuthDto,
  ): Promise<{ accessToken: string } | { error: any }> {
    return this.authService.register(authDto);
  }

  @Post('login')
  login(
    @Body() authDto: AuthDto,
  ): Promise<{ accessToken: string } | UnauthorizedException | { error: any }> {
    return this.authService.login(authDto);
  }
}
