import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { OptionalGuard } from '../auth/guards/optional.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(OptionalGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return await this.postService.create(req, createPostDto);
  }

  @UseGuards(OptionalGuard)
  @Get(':key')
  async get(@Param('key') key: string, @Req() req: Request) {
    return await this.postService.get(req, key);
  }

  @UseGuards(OptionalGuard)
  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() updatePostData: UpdatePostDto,
    @Req() req: Request,
  ) {
    return await this.postService.patch(req, key, updatePostData);
  }

  @UseGuards(OptionalGuard)
  @Delete(':key')
  async delete(@Param('key') key: string, @Req() req: Request) {
    return await this.postService.delete(req, key);
  }
}
