import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, 
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { OptionalGuard } from '../auth/guards/optional.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsePostDto } from './dto/response-post.dto';
import { AccessGuard } from '../auth/guards/access.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get('user/:username')
  async getListPostsByUsername(
    @Param('username') username: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.postService.getListPostsByUsername(
      paginationDto,
      username,
    );
  }

  @UseGuards(AccessGuard)
  @Get('user')
  async getListMyPosts(
    @Req() req: Request,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.postService.getListMyPosts(req['user'], paginationDto);
  }

  @Get('public')
  async getListPublicPosts(@Query() paginationDto: PaginationDto) {
    return await this.postService.getListPublicPosts(paginationDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: ResponsePostDto,
  })
  @UseGuards(OptionalGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<ResponsePostDto> {
    return await this.postService.create(req, createPostDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post got successfully',
    type: ResponsePostDto,
  })
  @UseGuards(OptionalGuard)
  @Get(':key')
  async get(
    @Param('key') key: string,
    @Req() req: Request,
  ): Promise<ResponsePostDto> {
    return await this.postService.get(req, key);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: ResponsePostDto,
  })
  @UseGuards(AccessGuard)
  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() updatePostData: UpdatePostDto,
    @Req() req: Request,
  ): Promise<ResponsePostDto> {
    return await this.postService.patch(req, key, updatePostData);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete post',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      example: { success: true },
    },
  })
  @UseGuards(AccessGuard)
  @Delete(':key')
  async delete(@Param('key') key: string, @Req() req: Request) {
    return await this.postService.delete(req, key);
  }
}
