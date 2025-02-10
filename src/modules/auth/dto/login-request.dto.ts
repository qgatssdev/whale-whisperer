import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
