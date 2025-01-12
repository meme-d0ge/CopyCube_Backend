import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUserData: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(createUserData);
  }
  @Patch()
  async updatePassword() {}
  @Delete()
  async deleteUser() {}
}
