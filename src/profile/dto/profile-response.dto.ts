import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @Expose()
  displayName: string;

  @Expose()
  avatar: string;

  @Expose()
  CreateDate: Date;
}
