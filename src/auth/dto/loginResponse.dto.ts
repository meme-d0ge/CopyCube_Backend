import { UserResponseDto } from '../../user/dto/user-response.dto';
import { Expose } from 'class-transformer';
import { ResponseJwtDto } from '../../common/token/dto/response-jwt.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: {
      id: '5',
      username: 'Arlion',
      CreateDate: '2025-01-09T19:34:15.080Z',
      UpdateDate: '2025-01-09T19:34:15.080Z',
    },
    description: 'User',
  })
  @Expose()
  user: UserResponseDto;

  @ApiProperty({
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJ1c2VybmFtZSI6IkFybGlvbiIsImlhdCI6MTczNjUxODYxNiwiZXhwIjoxNzM2NTE4NzM2fQ.oNywg7pt6LE9uocND-GKg24DU95sbS4pRuek0B3TnRI',
      iat: 1736683277,
      exp: 1736683397,
    },
    description: 'Access Token',
  })
  @Expose()
  accessToken: ResponseJwtDto;
}
