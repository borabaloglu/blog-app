import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { FriendshipsFollowDto } from 'src/modules/friendships/dto/friendships.follow.dto';
import { FriendshipsUnfollowDto } from 'src/modules/friendships/dto/friendships.unfollow.dto';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

@Injectable()
export class FriendshipsService {
  constructor(@InjectModel(Friendship) private readonly model: typeof Friendship) {}

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
