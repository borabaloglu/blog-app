import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FriendshipsController } from 'src/modules/friendships/friendships.controller';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Module({
  imports: [SequelizeModule.forFeature([Friendship, User])],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
})
export class FriendshipsModule {}
