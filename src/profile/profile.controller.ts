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

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @UseGuards(AccessGuard)
  @Get()
  async getProfile(@Req() req) {
    return await this.profileService.getProfile(req.user);
  }
  @Get(':username')
  async getProfileByUsername(@Param('username') username: string) {
    return await this.profileService.getProfileByUsername(username);
  }

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
