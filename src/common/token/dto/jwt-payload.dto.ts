import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class JwtPayloadDto {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  username: string;
}
