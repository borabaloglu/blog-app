import * as validator from 'class-validator';

import { Controller, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FriendshipsFollowDto } from 'src/modules/friendships/dto/friendships.follow.dto';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post('/follow/:followingId')
  @UseGuards(AuthGuard('user-from-jwt'))
  async follow(@Param() dto: FriendshipsFollowDto, @Req() req: any): Promise<Friendship> {
    if (validator.isDefined(dto.followerId)) {
      throw new UnauthorizedException();
    }
    dto.followerId = req.user.id;

    return this.friendshipsService.follow(dto);
  }
}
