import {
  Body,
  Controller,
  Delete,
  Logger,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from '../auth/guards/access.guard';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);
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
    this.logger.log('POST Request /api/user');
    return await this.userService.createUser(createUserData);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user password',
  })
  @ApiResponse({
    status: 200,
    description: 'User password updated successfully',
    schema: {
      example: { success: true },
    },
  })
  @UseGuards(AccessGuard)
  @Patch()
  async updatePassword(@Req() req, @Body() updateUserData: UpdateUserDto) {
    this.logger.log('PATCH Request /api/user');
    return await this.userService.updatePassword(updateUserData, req.user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: 201,
    description: 'User deleted successfully',
    schema: {
      example: { success: true },
    },
  })
  @UseGuards(AccessGuard)
  @Delete()
  async deleteUser(@Req() req, @Body() deleteUserData: DeleteUserDto) {
    this.logger.log('DELETE Request /api/user');
    return await this.userService.deleteUser(deleteUserData, req.user);
  }
}
