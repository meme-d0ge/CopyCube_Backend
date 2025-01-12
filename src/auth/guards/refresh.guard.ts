import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../../common/token/token.service';
import { plainToInstance } from 'class-transformer';
import { ResponseJwtDto } from '../../common/token/dto/response-jwt.dto';
import { JwtPayloadDto } from '../../common/token/dto/jwt-payload.dto';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies;
    if (cookie['refresh-token']) {
      const token = cookie['refresh-token'];
      const result = await this.tokenService.verifyRefreshToken(token);
      if (!result) {
        return false;
      }
      request['payload'] = plainToInstance(JwtPayloadDto, result, {
        excludeExtraneousValues: true,
      });
      request['token'] = plainToInstance(
        ResponseJwtDto,
        {
          token: token,
          iat: result.iat,
          exp: result.exp,
        },
        { excludeExtraneousValues: true },
      );
      return true;
    } else return false;
  }
}
