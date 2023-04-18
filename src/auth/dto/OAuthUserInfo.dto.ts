import { IsString, IsEmail, IsOptional } from 'class-validator';

export class OAuthUserInfoDto {
  @IsEmail()
  email: string;

  @IsString()
  image: string;

  @IsString()
  intraId: string;

  @IsString()
  nickName: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
