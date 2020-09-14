import * as languages from 'country-language';

import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class PostsUpdateDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  postId?: number;

  @IsOptional()
  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 240)
  subtitle?: string;

  @IsOptional()
  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 20000)
  content?: string;

  @IsOptional()
  @Transform((value: string) => value.trim())
  @IsString()
  @IsIn(languages.getLanguageCodes(1))
  language?: string;
}
