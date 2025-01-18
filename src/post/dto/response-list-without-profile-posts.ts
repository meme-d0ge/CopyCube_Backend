import { Expose } from 'class-transformer';
import { ResponseWithoutProfilePostDto } from './response-without-profile-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TypePost } from '../enum/post-type.enum';

export class ResponseListWithoutProfilePostsDto {
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
        key: 'kAqGzzS21MU2oUxTdNWTtQ',
        body: 'https://storage.yandexcloud.net/copycube-posts/-Z7OfW2zbO1sRcdDWgwP3e3T13RkYM26kMN6zqomnys',
        type: TypePost.PUBLIC,
        created: '2025-01-18T11:56:33.151Z',
        updated: '2025-01-18T11:56:33.151Z',
      },
      {
        key: 'Vc5wZTnW1KJLotsoa-WSOA',
        body: 'https://storage.yandexcloud.net/copycube-posts/uCKrWo87JLspXKG0jbfgqwGlKcIJnGauPBg3NfEgAdU',
        type: TypePost.PUBLIC,
        created: '2025-01-18T12:10:22.493Z',
        updated: '2025-01-18T12:10:22.493Z',
      },
      {
        key: 'kpZdl6zYmQMK1LwTvp0g2g',
        body: 'https://storage.yandexcloud.net/copycube-posts/4gQgU9kbc9P9G7Eml71PkTGBRMcjEiultPqliYrKBqA',
        type: TypePost.PUBLIC,
        created: '2025-01-18T12:10:26.575Z',
        updated: '2025-01-18T12:10:26.575Z',
      },
    ],
    description: 'list of posts',
  })
  @Expose()
  posts: ResponseWithoutProfilePostDto[];
}
