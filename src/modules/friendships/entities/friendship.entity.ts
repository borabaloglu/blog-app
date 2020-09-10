import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';

import { User } from 'src/modules/users/entities/user.entity';

@Scopes(() => ({
  followers: {
    attributes: ['createdAt'],
    include: [
      {
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'fullname', 'profileImageUrl'],
      },
    ],
  },
  followings: {
    attributes: ['createdAt'],
    include: [
      {
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'fullname', 'profileImageUrl'],
      },
    ],
  },
}))
@Table({ updatedAt: false })
export class Friendship extends Model<Friendship> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  followerId: number;

  @BelongsTo(() => User, 'followerId')
  follower: User;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  followingId: number;

  @BelongsTo(() => User, 'followingId')
  following: User;
}
