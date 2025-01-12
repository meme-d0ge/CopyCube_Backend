import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({
    example: ')(*$W&R*)WE(R*EWR0239q7r8469482',
    description: "User's Password",
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiProperty({
    example: '38ieWEF&**(DS&TW^^RE*DT&(S*)#*W(EDI',
    description: "User's new Password",
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  newPassword: string;
}
