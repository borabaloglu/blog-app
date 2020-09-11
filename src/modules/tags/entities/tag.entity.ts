import { Column, DataType, Model, PrimaryKey, Table, BelongsToMany } from 'sequelize-typescript';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/posts/entities/post-tag.entity';

@Table({ timestamps: false })
export class Tag extends Model<Tag> {
  @PrimaryKey
  @Column({ type: DataType.STRING(64) })
  name: string;

  @BelongsToMany(
    () => Post,
    () => PostTag,
  )
  posts: Post[];
}
