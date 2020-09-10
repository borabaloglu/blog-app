import { Module } from '@nestjs/common';

import { FriendshipsController } from 'src/modules/friendships/friendships.controller';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Module({
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
})
export class FriendshipsModule {}
