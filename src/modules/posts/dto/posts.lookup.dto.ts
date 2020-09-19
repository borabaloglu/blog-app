import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

import lookupHelper from 'src/shared/helpers/lookup.helper';
import { PostType } from '../entities/post.entity';

export class PostsLookupDto {
  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => +item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsInt({ each: true })
  @Min(1, { each: true })
  postIds?: number[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => +item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsInt({ each: true })
  @Min(1, { each: true })
  authorIds?: number[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  slugs?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  titles?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 240, { each: true })
  @Matches(/[^\s]/, { each: true })
  subtitles?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 240, { each: true })
  @Matches(/[^\s]/, { each: true })
  contents?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 5, { each: true })
  @Matches(/[^\s]/, { each: true })
  languages?: string[];

  @IsOptional()
  @Transform((value: string) => PostType[value.toUpperCase()])
  @IsEnum(PostType)
  type?: number;

  @IsOptional()
  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  tags?: string[];

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
