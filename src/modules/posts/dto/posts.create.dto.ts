import * as languages from 'country-language';

import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBase64,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

import { PostType } from 'src/modules/posts/entities/post.entity';

export class PostsCreateDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  authorId?: number;

  @IsBase64()
  coverImage: string;

  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 100)
  title: string;

  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 240)
  subtitle: string;

  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 20000)
  content: string;

  @Transform((value: string) => value.trim())
  @IsString()
  @IsIn(languages.getLanguageCodes(1))
  language: string;

  @IsEnum(PostType)
  type: PostType;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  tags: string[];
}
