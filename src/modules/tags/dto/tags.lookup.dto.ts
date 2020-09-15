import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class TagsLookupDto {
  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 64, { each: true })
  @Matches(/[^\s]/, { each: true })
  names?: string[];

  @IsOptional()
  @Transform((value: string) => value.split(',').map(item => item.trim()))
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(32)
  @Length(1, 64, { each: true })
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
