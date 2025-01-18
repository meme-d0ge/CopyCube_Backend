import { ResponsePostDto } from './response-post.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TypePost } from '../enum/post-type.enum';

export class ResponseListPublicPostsDto {
  @ApiProperty({
    example: '3',
    description: 'number of posts',
  })
  @Expose()
  total: number;

  @ApiProperty({
    example: '1',
    description: 'page number',
  })
  @Expose()
  page: number;

  @ApiProperty({
    example: '10',
    description: 'limit quantity',
  })
  @Expose()
  limit: number;

  @ApiProperty({
    example: [
      {
        key: 'O_LMdJXyaN3InZChGrd-wg',
        body: 'https://storage.yandexcloud.net/copycube-posts/K5Vhxj3LWwDDVFftcK53QSpi1ydiKumK1iJGpyCbyI4',
        type: TypePost.PUBLIC,
        created: '2025-01-18T11:55:51.435Z',
        updated: '2025-01-18T11:55:51.435Z',
      },
      {
        key: 'O_LMdJXyaN3InZChGrd-wg',
        body: 'https://storage.yandexcloud.net/copycube-posts/K5Vhxj3LWwDDVFftcK53QSpi1ydiKumK1iJGpyCbyI4',
        type: TypePost.PUBLIC,
        created: '2025-01-18T11:55:51.435Z',
        updated: '2025-01-18T11:55:51.435Z',
      },
      {
        key: 'O_LMdJXyaN3InZChGrd-wg',
        body: 'https://storage.yandexcloud.net/copycube-posts/K5Vhxj3LWwDDVFftcK53QSpi1ydiKumK1iJGpyCbyI4',
        type: TypePost.PUBLIC,
        created: '2025-01-18T11:55:51.435Z',
        updated: '2025-01-18T11:55:51.435Z',
      },
    ],
    description: 'list of posts',
  })
  @Expose()
  posts: ResponsePostDto[];
}
