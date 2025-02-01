import { TypePost } from '../enum/post-type.enum';
import { Expose } from 'class-transformer';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponsePostDto {
  @ApiProperty({
    example: 'GcrlAkGbCD_LjVC7y7J9vA',
    description: 'key reference',
  })
  @Expose()
  key: string;

  @ApiProperty({
    example: 'Title',
    description: 'title post',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example:
      'https://storage.yandexcloud.net/copycube-posts/JpnGGFXf26QBVBCna2cJms93ITycH9jPunTSPzZUE2o',
    description: 'link to content in s3 cloud',
  })
  @Expose()
  body: string;

  @ApiProperty({
    example: 'public',
    description: 'Post type',
  })
  @Expose()
  type: TypePost;

  @ApiProperty({
    example: {
      username: 'Meme_Doge',
      displayName: 'NO_Meme_Doge',
      avatar:
        'https://storage.yandexcloud.net/copycube-avatars/2d57edf1-b205-4d76-8470-8a2e2e20c5a0',
      description: "hello i'm full stack",
      CreateDate: '2025-01-17T14:09:32.309Z',
      deleted: false,
    },
    description: 'user profile of the user who created the post',
  })
  @Expose()
  profile: ProfileResponseDto;

  @ApiProperty({
    example: '2025-01-17T15:50:46.345Z',
    description: 'Date of profile creation',
  })
  @Expose()
  created: Date;

  @ApiProperty({
    example: '2025-01-17T15:50:46.345Z',
    description: 'Date of profile updated',
  })
  @Expose()
  updated: Date;
}
