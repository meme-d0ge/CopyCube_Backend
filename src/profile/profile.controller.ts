import {
  Body,
  Controller,
  Get,
  Logger,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { OwnerProfileResponseDto } from './dto/owner-profile-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller('profile')
export class ProfileController {
  private logger = new Logger(ProfileController.name);
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
    this.logger.log('GET Request /api/profile');
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
    this.logger.log('GET Request /api/profile/:username');
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload an image file',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
        displayName: {
          type: 'string',
          format: 'string',
          example: 'Meme_Doge_display_name',
        },
        description: {
          type: 'string',
          format: 'string',
          example: 'User Description',
        },
      },
      required: [],
    },
  })
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch()
  async patchProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @Req() req,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    this.logger.log('PATCH Request /api/profile');
    return await this.profileService.patchProfile(
      updateProfileData,
      req.user,
      avatar,
    );
  }
}
