import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString, Length, Matches, MaxDate, MinDate } from 'class-validator';

export class UsersCreateDto {
  @IsEmail()
  @Length(1, 254)
  email: string;

  @IsString()
  @Length(1, 64)
  @Matches(/[^\s]/)
  username: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  password: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  passwordConfirmation: string;

  @IsString()
  @Length(1, 256)
  @Matches(/[^\s]/)
  fullname: string;

  @Transform((value: string) => new Date(value))
  @IsDate()
  @MinDate(new Date('1920-01-01'))
  @MaxDate(new Date('2002-01-01'))
  dateOfBirth: Date;
}
