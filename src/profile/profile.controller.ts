import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AccessGuard } from '../auth/guards/access.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OwnerProfileResponseDto } from './dto/owner-profile-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get your profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Got your profile successfully',
    type: OwnerProfileResponseDto,
  })
  @UseGuards(AccessGuard)
  @Get()
  async getProfile(@Req() req): Promise<OwnerProfileResponseDto> {
    return await this.profileService.getProfile(req.user);
  }

  @ApiOperation({
    summary: 'Get profile by username',
  })
  @ApiResponse({
    status: 200,
    description: 'Got profile bu username successfully',
    type: ProfileResponseDto,
  })
  @Get(':username')
  async getProfileByUsername(
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    return await this.profileService.getProfileByUsername(username);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change your profile',
  })
  @ApiResponse({
    status: 200,
    description: 'change your profile successfully',
    schema: {
      example: { success: true },
    },
  })
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async patchProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileData: UpdateProfileDto,
    @Req() req,
  ) {
    return await this.profileService.patchProfile(
      updateProfileData,
      file,
      req.user,
    );
  }
}
