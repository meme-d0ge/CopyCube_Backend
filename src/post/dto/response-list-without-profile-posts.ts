import { Expose } from 'class-transformer';
import { ResponseWithoutProfilePostDto } from './response-without-profile-post.dto';

export class ResponseListWithoutProfilePostsDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  posts: ResponseWithoutProfilePostDto[];
}
