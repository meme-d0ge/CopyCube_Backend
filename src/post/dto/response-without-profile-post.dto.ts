import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TypePost } from '../enum/post-type.enum';

export class ResponseWithoutProfilePostDto {
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
