import { TypePost } from '../enum/post-type.enum';
import { Expose } from 'class-transformer';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';

export class ResponsePostDto {
  @Expose()
  created: Date;

  @Expose()
  updated: Date;

  @Expose()
  key: string;

  @Expose()
  body: string;

  @Expose()
  type: TypePost;

  @Expose()
  profile: ProfileResponseDto;
}
