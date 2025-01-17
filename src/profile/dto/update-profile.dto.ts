import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Meme_Doge_display_name',
    description: 'DisplayName',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({
    example: 'Beginning FullStack programmer',
    description: 'User Description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
