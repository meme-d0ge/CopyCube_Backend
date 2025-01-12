import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '1',
    description: 'User ID',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Meme_Doge', description: 'Username User' })
  @Expose()
  username: string;

  @ApiProperty({
    example: '2025-01-08T11:24:06.298Z',
    description: 'User creation date',
  })
  @Expose()
  CreateDate: Date;

  @ApiProperty({
    example: '2025-01-08T11:24:06.298Z',
    description: 'User modification date',
  })
  @Expose()
  UpdateDate: Date;
}
