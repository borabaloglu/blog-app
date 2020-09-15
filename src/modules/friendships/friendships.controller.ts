import * as validator from 'class-validator';

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ParseInt } from 'src/shared/pipes/parse-int.pipe';

import { FriendshipsFollowDto } from 'src/modules/friendships/dto/friendships.follow.dto';
import { FriendshipsUnfollowDto } from 'src/modules/friendships/dto/friendships.unfollow.dto';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';

import { FriendshipsService } from 'src/modules/friendships/friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get('/@me/followers')
  @UseGuards(AuthGuard('user-from-jwt'))
  async getFollowersOfCurrentUser(@Req() req: any): Promise<Friendship[]> {
    return this.friendshipsService.getFollowers(req.user.id);
  }

  @Get('/@me/followings')
  @UseGuards(AuthGuard('user-from-jwt'))
  async getFollowingsOfCurrentUser(@Req() req: any): Promise<Friendship[]> {
    return this.friendshipsService.getFollowings(req.user.id);
  }

  @Get('/@me/relationship/:userId')
  @UseGuards(AuthGuard('user-from-jwt'))
  async getFollowRelationship(
    @Param('userId', ParseInt) userId: number,
    @Req() req: any,
  ): Promise<{ isFollower: boolean; isFollowing: boolean }> {
    return this.friendshipsService.getFollowRelationship(req.user.id, userId);
  }

  @Post('/:followingId')
  @UseGuards(AuthGuard('user-from-jwt'))
  async follow(@Param() dto: FriendshipsFollowDto, @Req() req: any): Promise<Friendship> {
    if (validator.isDefined(dto.followerId)) {
      throw new UnauthorizedException();
    }
    dto.followerId = req.user.id;

    return this.friendshipsService.follow(dto);
  }

  @Delete('/:followingId')
  @UseGuards(AuthGuard('user-from-jwt'))
  async unfollow(@Param() dto: FriendshipsUnfollowDto, @Req() req: any): Promise<void> {
    if (validator.isDefined(dto.followerId)) {
      throw new UnauthorizedException();
    }
    dto.followerId = req.user.id;

    return this.friendshipsService.unfollow(dto);
  }
}
