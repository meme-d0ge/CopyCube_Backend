import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  private logger = new Logger(RedisService.name);
  async addRefreshToken(
    userId: string,
    refreshToken: string,
    ttl: number,
  ): Promise<string> {
    this.logger.log(`Add RefreshToken for userId ${userId}`);
    return this.redisClient.set(
      `user:${userId}:refresh_token:${refreshToken}`,
      'exists',
      'EX',
      ttl,
    );
  }
  async checkRefreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<string> {
    this.logger.log(`Check RefreshToken for userId ${userId}`);
    return this.redisClient.get(`user:${userId}:refresh_token:${refreshToken}`);
  }
  async deleteRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<number> {
    this.logger.log(`Delete RefreshToken for userId ${userId}`);
    return this.redisClient.del(`user:${userId}:refresh_token:${refreshToken}`);
  }

  async deleteUserRefreshTokens(userId: string) {
    this.logger.log(`Delete all tokens from userId: ${userId}`);
    const pattern = `user:${userId}:refresh_token:*`;
    let count = 0;
    const stream = this.redisClient.scanStream({
      match: pattern,
      count: 100,
    });
    const keysToDelete: string[] = [];
    for await (const keys of stream) {
      keysToDelete.push(...keys);
    }
    if (keysToDelete.length > 0) {
      await this.redisClient.del(...keysToDelete);
      count = count + 1;
    }
    this.logger.verbose(
      `Deleted all token from userId: ${userId} Count tokens: ${count}`,
    );
  }
}
