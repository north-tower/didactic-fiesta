// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenBlacklistService } from './services/token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent') || '';
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent') || '';
    return this.authService.refreshToken(refreshTokenDto, ipAddress, userAgent);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user) {
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user,
    @Body() { refreshToken }: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const accessToken = req.headers.authorization;
    await this.authService.logout(user.id, refreshToken, accessToken);
    return { message: 'Successfully logged out' };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const accessToken = req.headers.authorization;
    await this.authService.revokeAllUserTokens(user.id);
    this.tokenBlacklistService.addToBlacklist(accessToken);
    return { message: 'Successfully logged out from all devices' };
  }
}
