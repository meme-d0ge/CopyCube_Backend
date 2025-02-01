import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { TypePost } from './enum/post-type.enum';
import { S3Service } from '../common/s3/s3.service';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import { ResponsePostDto } from './dto/response-post.dto';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from '../profile/dto/profile-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtPayloadDto } from '../common/token/dto/jwt-payload.dto';
import { ResponseListPublicPostsDto } from './dto/response-list-public-posts.dto';
import { ResponseListWithoutProfilePostsDto } from './dto/response-list-without-profile-posts';
import { ResponseWithoutProfilePostDto } from './dto/response-without-profile-post.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private s3Service: S3Service,
  ) {}

  async getListMyPosts(
    payload: JwtPayloadDto,
    paginationData: PaginationDto,
  ): Promise<ResponseListWithoutProfilePostsDto> {
    const user = await this.userRepository.findOne({
      where: { id: Number(payload.id) },
      relations: ['profile', 'profile.user'],
    });
    if (!user) throw new NotFoundException('User not found');
    const [posts, total] = await this.postRepository.findAndCount({
      where: { profile: { id: user.profile.id } },
      order: {
        updated: 'DESC',
      },
      skip: (paginationData.page - 1) * paginationData.limit,
      take: paginationData.limit,
    });
    const posts_response = await Promise.all(
      posts.map(async (post) => {
        const response_post: ResponseWithoutProfilePostDto = {
          created: post.created,
          updated: post.updated,
          key: post.key,
          title: post.title,
          body: await this.s3Service.getLinkPost(post.body),
          type: post.type,
        };
        return plainToInstance(ResponseWithoutProfilePostDto, response_post, {
          excludeExtraneousValues: true,
        });
      }),
    );
    return plainToInstance(
      ResponseListWithoutProfilePostsDto,
      {
        total: total,
        limit: paginationData.limit,
        page: paginationData.page,
        posts: posts_response,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
  async getListPostsByUsername(
    paginationData: PaginationDto,
    username: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['profile', 'profile.user'],
    });
    if (!user) throw new NotFoundException('User not found');
    const [posts, total] = await this.postRepository.findAndCount({
      where: { profile: { id: user.profile.id }, type: TypePost.PUBLIC },
      order: {
        created: 'DESC',
      },
      skip: (paginationData.page - 1) * paginationData.limit,
      take: paginationData.limit,
    });
    const posts_response = await Promise.all(
      posts.map(async (post) => {
        const response_post: ResponseWithoutProfilePostDto = {
          created: post.created,
          updated: post.updated,
          title: post.title,
          key: post.key,
          body: await this.s3Service.getLinkPost(post.body),
          type: post.type,
        };
        return plainToInstance(ResponseWithoutProfilePostDto, response_post, {
          excludeExtraneousValues: true,
        });
      }),
    );
    return plainToInstance(
      ResponseListWithoutProfilePostsDto,
      {
        total: total,
        limit: paginationData.limit,
        page: paginationData.page,
        posts: posts_response,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
  async getListPublicPosts(
    paginationData: PaginationDto,
  ): Promise<ResponseListPublicPostsDto> {
    const skip = (paginationData.page - 1) * paginationData.limit;
    const [posts, total] = await this.postRepository.findAndCount({
      skip: skip,
      take: paginationData.limit,
      where: { type: TypePost.PUBLIC },
      order: {
        created: 'DESC',
      },
      relations: ['profile', 'profile.user'],
    });
    const posts_response = await Promise.all(
      posts.map(async (post) => {
        const response_post: ResponsePostDto = {
          created: post.created,
          updated: post.updated,
          key: post.key,
          title: post.title,
          body: await this.s3Service.getLinkPost(post.body),
          type: post.type,
          profile: plainToInstance(
            ProfileResponseDto,
            {
              ...post?.profile,
              username: post?.profile?.user?.username,
            },
            {
              excludeExtraneousValues: true,
            },
          ),
        };
        return plainToInstance(ResponsePostDto, response_post, {
          excludeExtraneousValues: true,
        });
      }),
    );
    return plainToInstance(
      ResponseListPublicPostsDto,
      {
        total: total,
        limit: paginationData.limit,
        page: paginationData.page,
        posts: posts_response,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async create(
    req: Request,
    createPostDto: CreatePostDto,
  ): Promise<ResponsePostDto> {
    let post: Post = null;
    const payload: JwtPayloadDto = req['user'];
    if (payload) {
      const user = await this.userRepository.findOne({
        where: { id: Number(payload.id) },
        relations: ['profile', 'profile.user'],
      });
      if (!user) throw new UnauthorizedException('Unauthorized');
      post = await this.createPost(createPostDto, user.profile);
    } else {
      if (createPostDto.type === TypePost.PRIVATE) {
        throw new BadRequestException(
          "anonymous user can't create private post",
        );
      }
      post = await this.createPost(createPostDto, null);
    }
    await this.postRepository.save(post);
    const response_post: ResponsePostDto = {
      created: post.created,
      updated: post.updated,
      key: post.key,
      title: post.title,
      body: await this.s3Service.getLinkPost(post.body),
      type: post.type,
      profile: plainToInstance(
        ProfileResponseDto,
        {
          ...post?.profile,
          username: post?.profile?.user.username,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    };
    return plainToInstance(ResponsePostDto, response_post, {
      excludeExtraneousValues: true,
    });
  }
  async get(req: Request, key_url: string): Promise<ResponsePostDto> {
    const post = await this.postRepository.findOne({
      where: {
        key: key_url,
      },
      relations: ['profile', 'profile.user'],
    });
    if (!post) throw new NotFoundException('Not Found');
    switch (post.type) {
      case TypePost.PUBLIC:
      case TypePost.LINK: {
        const response_post: ResponsePostDto = {
          created: post.created,
          updated: post.updated,
          key: post.key,
          title: post.title,
          body: await this.s3Service.getLinkPost(post.body),
          type: post.type,
          profile: plainToInstance(
            ProfileResponseDto,
            {
              ...post?.profile,
              username: post?.profile?.user.username,
            },
            {
              excludeExtraneousValues: true,
            },
          ),
        };
        return plainToInstance(ResponsePostDto, response_post, {
          excludeExtraneousValues: true,
        });
      }
      case TypePost.PRIVATE: {
        const payload = req['user'];
        if (!payload) throw new ForbiddenException('Post unavailable');
        if (post?.profile?.user?.id !== Number(payload.id)) {
          throw new ForbiddenException('Post unavailable');
        }
        const response_post: ResponsePostDto = {
          created: post.created,
          updated: post.updated,
          key: post.key,
          title: post.title,
          body: await this.s3Service.getLinkPost(post.body),
          type: post.type,
          profile: plainToInstance(
            ProfileResponseDto,
            {
              ...post?.profile,
              username: post?.profile?.user.username,
            },
            {
              excludeExtraneousValues: true,
            },
          ),
        };
        return plainToInstance(ResponsePostDto, response_post, {
          excludeExtraneousValues: true,
        });
      }
    }
  }
  async patch(req: Request, key: string, updatePostData: UpdatePostDto) {
    const payload = req['user'];
    const post = await this.postRepository.findOne({
      where: {
        key: key,
      },
      relations: ['profile', 'profile.user'],
    });
    if (!post) throw new NotFoundException('Not Found');
    if (post?.profile?.user?.id !== Number(payload.id)) {
      throw new ForbiddenException("It's not your post");
    }
    let changes = 0;
    if (updatePostData?.type && updatePostData.type !== post.type) {
      post.type = updatePostData.type;
      changes++;
    }
    if (
      updatePostData?.body &&
      crypto.createHash('sha256').update(updatePostData.body).digest('hex') !==
        post.hash
    ) {
      const s3_key = crypto.randomBytes(32).toString('base64url');
      await this.s3Service.uploadPost(Buffer.from(updatePostData.body), s3_key);
      await this.s3Service.removePost(post.body);
      post.body = s3_key;
      changes++;
    }
    if (changes > 0) {
      post.key = crypto.randomBytes(16).toString('base64url');
      const new_post = await this.postRepository.save(post);
      return plainToInstance(
        ResponsePostDto,
        {
          ...new_post,
          body: await this.s3Service.getLinkPost(new_post.body),
          profile: plainToInstance(
            ProfileResponseDto,
            {
              ...new_post?.profile,
              username: new_post?.profile?.user.username,
            },
            {
              excludeExtraneousValues: true,
            },
          ),
        },
        { excludeExtraneousValues: true },
      );
    }

    return plainToInstance(
      ResponsePostDto,
      {
        ...post,
        body: await this.s3Service.getLinkPost(post.body),
        profile: plainToInstance(
          ProfileResponseDto,
          {
            ...post?.profile,
            username: post?.profile?.user.username,
          },
          {
            excludeExtraneousValues: true,
          },
        ),
      },
      { excludeExtraneousValues: true },
    );
  }
  async delete(req: Request, key: string) {
    const payload = req['user'];
    const post = await this.postRepository.findOne({
      where: { key: key },
      relations: ['profile', 'profile.user'],
    });
    if (!post) throw new NotFoundException('Not Found');
    if (post?.profile?.user?.id !== Number(payload.id)) {
      throw new ForbiddenException("It's not your post");
    }
    await this.postRepository.remove(post);
    return { success: true };
  }

  private async createPost(
    createPostDto: CreatePostDto,
    profile: Profile,
  ): Promise<Post> {
    const url = crypto.randomBytes(16).toString('base64url');
    const s3_key = crypto.randomBytes(32).toString('base64url');
    await this.s3Service.uploadPost(Buffer.from(createPostDto.body), s3_key);
    return this.postRepository.create({
      title: createPostDto.title,
      key: url,
      body: s3_key,
      hash: crypto
        .createHash('sha256')
        .update(createPostDto.body)
        .digest('hex'),
      type: createPostDto.type,
      profile: profile,
    });
  }
}
