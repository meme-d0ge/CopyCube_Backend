import { Expose } from 'class-transformer';

export class OwnerProfileResponseDto {
  @Expose()
  displayName: string;

  @Expose()
  avatar: string;

  @Expose()
  CreateDate: Date;

  @Expose()
  UpdateDate: Date;
}
