import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';

@Table({
  timestamps: false,
})
export class PostTag extends Model<PostTag> {
  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.STRING(64), allowNull: false })
  tagName: string;
}
