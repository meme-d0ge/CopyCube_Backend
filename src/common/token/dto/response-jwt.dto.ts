import { Entity } from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ResponseJwtDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJ1c2VybmFtZSI6IkFybGlvbiIsImlhdCI6MTczNjUyMjE2NSwiZXhwIjoxNzM2NTIyMjg1fQ.iW9GxirPF3Tmy8XmdeTcDojBOmKxubkdORKWkbXMcmc',
    description: 'jwt token',
  })
  @Expose()
  token: string;

  @ApiProperty({
    example: '1736683277',
    description: 'token creation time',
  })
  @Expose()
  iat: number;

  @ApiProperty({
    example: '1736683397',
    description: 'token time of death',
  })
  @Expose()
  exp: number;
}
