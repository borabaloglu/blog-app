import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UsersLoginDto {
  @IsEmail()
  @Length(1, 254)
  email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  password: string;
}
