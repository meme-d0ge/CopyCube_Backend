import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RefreshGuard } from './guards/refresh.guard';
import * as Express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res() res: Express.Response) {
    await this.authService.refresh(req['payload'], res);
  }

  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({
    status: 201,
    description: 'User login successfully',
    type: LoginResponseDto,
  })
  @Post('login')
  async login(@Body() loginData: LoginDto, @Res() res: Express.Response) {
    return await this.authService.login(loginData, res);
  }

  @UseGuards(RefreshGuard)
  @Delete('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req['token'], req['payload']);
  }
}
