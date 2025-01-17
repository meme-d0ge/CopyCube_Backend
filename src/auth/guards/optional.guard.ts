import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../../common/token/token.service';

@Injectable()
export class OptionalGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.tokenService.extractTokenFromHeader(request);
      if (!token) {
        return true;
      }
      const payload = await this.tokenService.verifyAccessToken(token);
      if (!payload) {
        return true;
      }
      request['user'] = payload;
    } catch {
      return true;
    }
    return true;
  }
}
