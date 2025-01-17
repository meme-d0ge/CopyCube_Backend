import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypePost } from '../enum/post-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'any post title',
    description: 'Post title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Hello world i'm full stack programmer",
    description: 'post content',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example: 'public',
    description: 'Post type',
  })
  @IsNotEmpty()
  @IsEnum(TypePost, {
    message: 'type must be one of: private, link, public',
  })
  type: TypePost;
}
