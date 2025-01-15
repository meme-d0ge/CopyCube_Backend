import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayloadDto } from '../common/token/dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { OwnerProfileResponseDto } from './dto/owner-profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from '../common/s3/s3.service';

import { v4 as uuid4 } from 'uuid';
import { Profile } from './entities/profile.entity';
import * as crypto from 'node:crypto';
import * as sharp from 'sharp';
import { Buffer } from 'buffer';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private s3Service: S3Service,
  ) {}

  async getProfile(payloadJwt: JwtPayloadDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: Number(payloadJwt.id),
      },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(OwnerProfileResponseDto, user.profile, {
      excludeExtraneousValues: true,
    });
  }
  async getProfileByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(ProfileResponseDto, user.profile, {
      excludeExtraneousValues: true,
    });
  }

  async patchProfile(
    updateProfileData: UpdateProfileDto,
    image: Express.Multer.File,
    payloadJwt: JwtPayloadDto,
  ) {
    if (
      updateProfileData.displayName ||
      image ||
      updateProfileData.description
    ) {
      const user = await this.userRepository.findOne({
        where: {
          id: Number(payloadJwt.id),
        },
        relations: ['profile'],
      });
      const profile = user.profile;

      if (updateProfileData.displayName) {
        if (updateProfileData.displayName !== profile.displayName) {
          profile.displayName = updateProfileData.displayName;
        }
      }
      if (updateProfileData.description) {
        if (updateProfileData.description !== profile.description) {
          profile.description = updateProfileData.description;
        }
      }
      if (image) {
        const hash_avatar = crypto
          .createHash('md5')
          .update(image.buffer)
          .digest('hex');

        if (hash_avatar !== profile.avatar_hash) {
          try {
            const resultCheck = await this.checkImage(image.buffer);
            if (!resultCheck) {
              throw new Error();
            }

            const key_file = uuid4();
            const result = await this.s3Service.uploadAvatar(
              image.buffer,
              key_file,
            );
            if (result) {
              profile.avatar = await this.s3Service.getLinkAvatar(key_file);
              profile.avatar_hash = hash_avatar;
            }
          } catch {
            throw new BadRequestException(
              'Avatar should be jpeg or png format with size not more than 100kb',
            );
          }
        }
      }

      await this.profileRepository.save(profile);
      return { success: true };
    }
  }
  async checkImage(image: Buffer<ArrayBuffer>) {
    const meta = await sharp(image).metadata();
    if (meta && !(meta.format === 'png' || meta.format === 'jpeg')) {
      return false;
    }
    const size = meta.size;
    if (size > 100 * 1024) return false;
    return true;
  }
}
