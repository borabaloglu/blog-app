import {
  AutoIncrement,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'lastLoginDate'],
  },
}))
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING(254), allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING(64), allowNull: false, unique: true })
  username: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  fullname: string;

  @Column({ type: DataType.STRING(240), allowNull: false, defaultValue: '' })
  biography: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  dateOfBirth: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  profileImageUrl: string;

  @Column({ type: DataType.DATE, defaultValue: null })
  lastLoginDate: Date;

  @HasMany(() => Friendship, 'followerId')
  followings: Friendship[];

  @HasMany(() => Friendship, 'followingId')
  followers: Friendship[];
}
