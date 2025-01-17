import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypePost } from '../enum/post-type.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsEnum(TypePost, {
    message: 'type must be one of: private, link, public',
  })
  type: TypePost;
}
