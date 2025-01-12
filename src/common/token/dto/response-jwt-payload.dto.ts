import { Expose } from 'class-transformer';

export class ResponseJwtPayload {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  iat: number;

  @Expose()
  exp: number;
}
