import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypePost } from '../enum/post-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    example: "Hello world i'm full stack",
    description: 'post content',
  })
  @IsOptional()
  @IsString()
  body: string;

  @ApiProperty({
    example: 'public',
    description: 'Post type',
  })
  @IsOptional()
  @IsEnum(TypePost, {
    message: 'type must be one of: private, link, public',
  })
  type: TypePost;
}
