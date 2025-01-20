import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    example: 'Meme_Doge',
    description: 'username',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'Meme_Doge_display_name',
    description: 'DisplayName',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    example: 'Beginning FullStack programmer',
    description: 'User Description',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    example:
      'https://storage.yandexcloud.net/copycube-avatars/2d57edf1-b205-4d76-8470-8a2e2e20c5a0',
    description: 'Avatar link in s3 cloud',
  })
  @Expose()
  avatar: string;

  @ApiProperty({
    example: '2025-01-17T15:50:46.345Z',
    description: 'Date of profile creation',
  })
  @Expose()
  CreateDate: Date;

  @ApiProperty({
    example: false,
    description:
      'Status according to which we understand whether the user has deleted his account.',
  })
  @Expose()
  deleted: boolean;
}
