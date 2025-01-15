import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisModule } from '../common/redis/redis.module';
import { TokenModule } from '../common/token/token.module';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    RedisModule,
    TokenModule,
  ],
})
export class UserModule {}
