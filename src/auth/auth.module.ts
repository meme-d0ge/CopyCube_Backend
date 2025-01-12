import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../common/token/token.module';
import { RedisModule } from '../common/redis/redis.module';

@Module({
  imports: [TokenModule, TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
