import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  Length,
  Matches,
  Min,
  MinDate,
} from 'class-validator';

import lookupHelper from 'src/shared/helpers/lookup.helper';

export class UsersLookupDto {
  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => +item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsInt({ each: true })
  @Min(1, { each: true })
  userIds?: number[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsEmail({}, { each: true })
  @Length(1, 254, { each: true })
  emails?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  usernames?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 256, { each: true })
  @Matches(/[^\s]/, { each: true })
  fullnames?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 240, { each: true })
  @Matches(/[^\s]/, { each: true })
  biographies?: string[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map(date => new Date(date));
    return lookupHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  @MinDate(new Date('1920-01-01'), { each: true })
  dateOfBirthRange?: number[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map(date => (date.trim() === '' ? '' : new Date(date)));
    return lookupHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  lastLoginDateRange?: Date[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map(date => (date.trim() === '' ? '' : new Date(date)));
    return lookupHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  createdAtRange?: Date[];

  @IsOptional()
  @Transform((value: string) => {
    const parts = value.split(',').map(date => (date.trim() === '' ? '' : new Date(date)));
    return lookupHelper.transformRange(value, parts, new Date(0));
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  updatedAtRange?: Date[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 240, { each: true })
  @Matches(/[^\s]/, { each: true })
  search?: string[];

  @IsOptional()
  @Matches(/^[A-Za-z_]+-?(,[A-Za-z_]+-?)*$/)
  order?: string;

  @IsOptional()
  @Matches(/^[A-Za-z_]+(,[A-Za-z_]+)*$/)
  load?: string;

  @IsOptional()
  @Matches(/^[0-9]+(\.[1-9])?(,[0-9]+(\.[1-9])?)?$/)
  page?: string;
}
