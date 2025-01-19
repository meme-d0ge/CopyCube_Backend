import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { TokenService } from '../common/token/token.service';
import { JwtPayloadDto } from '../common/token/dto/jwt-payload.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { Response } from 'express';
import { ResponseJwtDto } from '../common/token/dto/response-jwt.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private tokenService: TokenService,
    private redisService: RedisService,
  ) {}
  async login(loginData: LoginDto, res: Response) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginData.username,
      },
    });
    if (!user || !(await argon.verify(user.password, loginData.password))) {
      throw new BadRequestException('User or Password invalid');
    } else {
      const payload: JwtPayloadDto = {
        id: String(user.id),
        username: user.username,
      };

      const access = await this.tokenService.generateAccessToken(payload);
      const refresh = await this.tokenService.generateRefreshToken(payload);

      const result: LoginResponseDto = {
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
        accessToken: access,
      };
      const format_result = plainToInstance(LoginResponseDto, result, {
        excludeExtraneousValues: true,
      });

      const time_live: number = (refresh.exp - refresh.iat) * 1000;
      res.cookie('refresh-token', refresh.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: time_live,
        path: '/auth/refresh',
      });
      res.cookie('refresh-token', refresh.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: time_live,
        path: '/auth/logout',
      });
      res.json(format_result);
    }
  }
  async logout(tokenJwt: ResponseJwtDto, payload: JwtPayloadDto) {
    await this.redisService.deleteRefreshToken(
      String(payload.id),
      tokenJwt.token,
    );
    return { success: true };
  }
  async refresh(jwtPayloadDto: JwtPayloadDto, res: Response) {
    const access = await this.tokenService.generateAccessToken({
      id: jwtPayloadDto.id,
      username: jwtPayloadDto.username,
    });
    const refresh = await this.tokenService.generateRefreshToken({
      id: jwtPayloadDto.id,
      username: jwtPayloadDto.username,
    });
    const time_live: number = (refresh.exp - refresh.iat) * 1000;
    res.cookie('refreshToken', refresh.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: time_live,
      path: '/auth/logout',
    });
    res.cookie('refreshToken', refresh.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: time_live,
      path: '/auth/refresh',
    });
    res.json(access);
  }
}
