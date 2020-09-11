import * as languages from 'country-language';

import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class PostsCreateDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  authorId?: number;

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

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  tags: string[];
}
