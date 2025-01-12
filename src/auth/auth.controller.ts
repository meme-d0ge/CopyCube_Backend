import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RefreshGuard } from './guards/refresh.guard';
import * as Express from 'express';
import { ResponseJwtDto } from '../common/token/dto/response-jwt.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get updated tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'Tokens updated successfully',
    type: ResponseJwtDto,
  })
  @ApiHeader({
    name: 'Cookie',
    description: 'refresh-token=<token>',
    required: true,
  })
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
  @ApiOperation({
    summary: 'logout',
  })
  @ApiResponse({
    status: 201,
    description: 'The user successfully logout',
    schema: {
      example: { success: true },
    },
  })
  @ApiHeader({
    name: 'Cookie',
    description: 'refresh-token=<token>',
    required: true,
  })
  @UseGuards(RefreshGuard)
  @Delete('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req['token'], req['payload']);
  }
}
