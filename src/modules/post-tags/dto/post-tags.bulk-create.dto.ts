import { IsInt, IsInstance, Min } from 'class-validator';

import { Tag } from 'src/modules/tags/entities/tag.entity';

export class PostTagsBulkCreateDto {
  @IsInt()
  @Min(1)
  postId: number;

  @IsInstance(Tag)
  tags: Tag[];
}
