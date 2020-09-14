import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class PostsUpdateTagsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  postId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  tags: string[];
}
