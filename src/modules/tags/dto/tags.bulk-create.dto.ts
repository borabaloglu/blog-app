import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class TagsBulkCreateDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  tags: string[];
}
