import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../common/token/token.module';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { S3Module } from '../common/s3/s3.module';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [
    TypeOrmModule.forFeature([Post, User, Profile]),
    TokenModule,
    S3Module,
  ],
})
export class PostModule {}
