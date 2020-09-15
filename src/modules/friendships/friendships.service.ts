import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { FriendshipsFollowDto } from 'src/modules/friendships/dto/friendships.follow.dto';
import { FriendshipsUnfollowDto } from 'src/modules/friendships/dto/friendships.unfollow.dto';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

@Injectable()
export class FriendshipsService {
  constructor(@InjectModel(Friendship) private readonly model: typeof Friendship) {}

  async getFollowers(userId: number): Promise<Friendship[]> {
    return this.model.scope('followers').findAll({
      where: {
        followingId: userId,
      },
    });
  }

  async getFollowings(userId: number): Promise<Friendship[]> {
    return this.model.scope('followings').findAll({
      where: {
        followerId: userId,
      },
    });
  }

  async getFollowRelationship(
    userId1: number,
    userId2: number,
  ): Promise<{ isFollower: boolean; isFollowing: boolean }> {
    const friendships = await this.model.findAll({
      where: {
        [Op.or]: [
          {
            followerId: userId1,
            followingId: userId2,
          },
          {
            followerId: userId2,
            followingId: userId1,
          },
        ],
      },
    });

    const result: any = {};

    result.isFollower = friendships
      .map(friendship => friendship.followingId === userId1)
      .includes(true);

    result.isFollowing = friendships
      .map(friendship => friendship.followingId === userId2)
      .includes(true);

    return result;
  }

  async follow(dto: FriendshipsFollowDto): Promise<Friendship> {
    if (dto.followingId === dto.followerId) {
      throw new ServerError(ServerErrorType.FRIENDSHIP_TRIED_TO_FOLLOW_SELF);
    }

    const entity = this.model.build();

    entity.followerId = dto.followerId;
    entity.followingId = dto.followingId;

    try {
      await entity.save();
      return entity;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ServerError(ServerErrorType.FRIENDSHIP_ALREADY_FOLLOWING);
      }
      throw error;
    }
  }

  async unfollow(dto: FriendshipsUnfollowDto): Promise<void> {
    const result = await this.model.destroy({
      where: {
        followerId: dto.followerId,
        followingId: dto.followingId,
      },
    });

    if (result !== 1) {
      throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
    }
  }
}
