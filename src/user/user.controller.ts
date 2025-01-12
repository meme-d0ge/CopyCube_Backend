import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create (Registry) user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @Post()
  async createUser(
    @Body() createUserData: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(createUserData);
  }
  @Patch()
  @ApiOperation({
    summary: 'Update user password',
  })
  @ApiResponse({
    status: 200,
    description: 'User password updated successfully',
  })
  async updatePassword() {}

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: 201,
    description: 'User deleted successfully',
  })
  @Delete()
  async deleteUser() {}
}
