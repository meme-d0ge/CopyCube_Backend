import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayloadDto } from '../common/token/dto/jwt-payload.dto';
import { RedisService } from '../common/redis/redis.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    private redisService: RedisService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(createUserData: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        username: createUserData.username,
      },
    });
    if (user) throw new BadRequestException('Username already exists');
    const userProfile = this.profileRepository.create({
      displayName: createUserData.displayName,
    });
    const newUser = this.userRepository.create({
      username: createUserData.username,
      password: await argon2.hash(createUserData.password),
      profile: userProfile,
    });
    await this.userRepository.save(newUser);
    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
    });
  }
  async updatePassword(updateUserData: UpdateUserDto, payload: JwtPayloadDto) {
    if (updateUserData.password === updateUserData.newPassword) {
      throw new BadRequestException(
        'the new password must be different from the old one',
      );
    }
    const user = await this.userRepository.findOne({
      where: {
        id: Number(payload.id),
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!(await argon2.verify(user.password, updateUserData.password))) {
      throw new BadRequestException('Wrong password');
    }
    user.password = await argon2.hash(updateUserData.newPassword);
    await this.redisService.deleteUserRefreshTokens(payload.id);
    await this.userRepository.save(user);

    return { success: true };
  }
  async deleteUser(deleteUserData: DeleteUserDto, payload: JwtPayloadDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: Number(payload.id),
      },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');
    if (!(await argon2.verify(user.password, deleteUserData.password))) {
      throw new BadRequestException('Wrong password');
    }
    await this.userRepository.remove(user);
    await this.redisService.deleteUserRefreshTokens(payload.id);
    const default_profile = this.profileRepository.create({
      ...user.profile,
      displayName: 'Deleted User',
      deleted: true,
    });
    await this.profileRepository.save(default_profile);
    return { success: true };
  }
}
