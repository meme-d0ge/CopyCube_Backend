import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ResponseJwtDto } from './dto/response-jwt.dto';
import { plainToInstance } from 'class-transformer';
import { RedisService } from '../redis/redis.service';
import { ResponseJwtPayload } from './dto/response-jwt-payload.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async verifyRefreshToken(token: string): Promise<ResponseJwtPayload | null> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt_refresh.secret'),
      });
      const result = await this.redisService.checkRefreshTokens(
        payload.id,
        token,
      );
      if (result !== 'exists') {
        return null;
      } else {
        return plainToInstance(
          ResponseJwtPayload,
          {
            ...payload,
          },
          { excludeExtraneousValues: true },
        );
      }
    } catch {
      return null;
    }
  }
  async verifyAccessToken(token: string): Promise<ResponseJwtPayload | null> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret'),
      });
    } catch {
      return null;
    }
  }

  async generateRefreshToken(payload: JwtPayloadDto): Promise<ResponseJwtDto> {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt_refresh.secret'),
      expiresIn: this.configService.get('jwt_refresh.expiresIn'),
    });
    const payload_token = this.jwtService.verify(token, {
      secret: this.configService.get('jwt_refresh.secret'),
    });

    const result_redis = await this.redisService.addRefreshToken(
      payload.id,
      token,
      payload_token.exp,
    );
    if (result_redis !== 'OK') {
      throw new InternalServerErrorException('Server Error');
    }
    const result: ResponseJwtDto = {
      token: token,
      iat: payload_token.iat,
      exp: payload_token.exp,
    };
    return plainToInstance(ResponseJwtDto, result, {
      excludeExtraneousValues: true,
    });
  }
  async generateAccessToken(payload: JwtPayloadDto): Promise<ResponseJwtDto> {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
    const payload_token = this.jwtService.verify(token, {
      secret: this.configService.get('jwt.secret'),
    });
    const result: ResponseJwtDto = {
      token: token,
      iat: payload_token.iat,
      exp: payload_token.exp,
    };
    return plainToInstance(ResponseJwtDto, result, {
      excludeExtraneousValues: true,
    });
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
