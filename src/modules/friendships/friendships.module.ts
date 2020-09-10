import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserAuthenticationStrategy } from 'src/shared/authentications/user/user.authentication.strategy';

import { FriendshipsController } from 'src/modules/friendships/friendships.controller';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Module({
  imports: [PassportModule.register({}), SequelizeModule.forFeature([Friendship, User])],
  controllers: [FriendshipsController],
  providers: [UserAuthenticationStrategy, FriendshipsService],
})
export class FriendshipsModule {}
