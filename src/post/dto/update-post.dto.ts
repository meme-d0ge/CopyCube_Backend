import { IsEnum, IsString } from 'class-validator';
import { TypePost } from '../enum/post-type.enum';

export class UpdatePostDto {
  @IsString()
  body: string;

  @IsEnum(TypePost, {
    message: 'type must be one of: private, link, public',
  })
  type: TypePost;
}
