import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [TokenService],
  imports: [JwtModule, RedisModule, ConfigModule],
  exports: [TokenService],
})
export class TokenModule {}
