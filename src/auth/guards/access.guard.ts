import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../common/token/token.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.tokenService.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }
      const payload = await this.tokenService.verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedException('Unauthorized');
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
