import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  displayName?: string;

  @IsString()
  description?: string;
}
