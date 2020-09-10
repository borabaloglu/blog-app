import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxDate,
  Min,
  MinDate,
} from 'class-validator';

export class UsersUpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  @Matches(/[^\s]/)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  @Matches(/[^\s]/)
  fullname?: string;

  @IsOptional()
  @IsString()
  @Length(1, 240)
  @Matches(/[^\s]/)
  biography?: string;

  @IsOptional()
  @Transform((value: string) => new Date(value))
  @IsDate()
  @MinDate(new Date('1920-01-01'))
  @MaxDate(new Date('2002-01-01'))
  dateOfBirth?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
