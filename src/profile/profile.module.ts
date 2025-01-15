import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../common/token/token.module';
import { Profile } from './entities/profile.entity';
import { S3Module } from '../common/s3/s3.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([User, Profile]), TokenModule, S3Module],
})
export class ProfileModule {}
