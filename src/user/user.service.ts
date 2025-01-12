import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserData: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        username: createUserData.username,
      },
    });
    if (user) new BadRequestException('Username already exists');
    const newUser = this.userRepository.create({
      username: createUserData.username,
      password: await argon2.hash(createUserData.password),
    });
    const resultDb = await this.userRepository.save(newUser);
    if (!resultDb) throw new InternalServerErrorException('User not created');
    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
    });
  }
  async updatePassword() {}
  async deleteUser() {}
}
