import { ResponsePostDto } from './response-post.dto';
import { Expose } from 'class-transformer';

export class ResponseListPublicPostsDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  posts: ResponsePostDto[];
}
