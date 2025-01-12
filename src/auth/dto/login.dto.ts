import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'Meme_Doge', description: 'Username User' })
  @IsString()
  username: string;

  @ApiProperty({
    example: ')(*$W&R*)WE(R*EWR0239q7r8469482',
    description: "User's Password",
  })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString()
  password: string;
}
