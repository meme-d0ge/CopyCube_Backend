import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
  private logger = new Logger(AuthController.name);
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
    this.logger.log('GET Request /api/auth/refresh');
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
    this.logger.log('POST Request /api/auth/login');
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
    this.logger.log('DELETE Request /api/auth/logout');
    return await this.authService.logout(req['token'], req['payload']);
  }
}
