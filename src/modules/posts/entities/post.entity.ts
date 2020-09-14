import * as validator from 'class-validator';

import slugify from 'slugify';

import {
  AutoIncrement,
  BeforeValidate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table({
  indexes: [
    {
      fields: ['authorId', 'slug'],
      unique: true,
    },
  ],
})
export class Post extends Model<Post> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  authorId: number;

  @BelongsTo(() => User, 'authorId')
  author: User;

  @Column({ type: DataType.STRING(100), allowNull: false })
  slug: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  title: string;

  @Column({ type: DataType.STRING(240), allowNull: true })
  subtitle: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @Column({ type: DataType.STRING(5), allowNull: false })
  language: string;

  @BelongsToMany(
    () => Tag,
    () => PostTag,
  )
  tags: Tag[];

  @BeforeValidate
  static generateSlug(instance: Post) {
    if (validator.isDefined(instance.title)) {
      instance.slug = slugify(instance.title, {
        lower: true,
        replacement: '-',
      });
    }
  }
}
