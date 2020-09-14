import * as validator from 'class-validator';

import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ParseInt } from 'src/shared/pipes/parse-int.pipe';

import { PostsCreateDto } from 'src/modules/posts/dto/posts.create.dto';
import { PostsUpdateDto } from 'src/modules/posts/dto/posts.update.dto';

import { Post as PostEntity } from 'src/modules/posts/entities/post.entity';

import { PostsService } from 'src/modules/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  @UseGuards(AuthGuard('user-from-jwt'))
  async create(@Body() dto: PostsCreateDto, @Req() req: any): Promise<PostEntity> {
    if (validator.isDefined(dto.authorId)) {
      throw new UnauthorizedException();
    }
    dto.authorId = req.user.id;

    return this.postsService.create(dto);
  }

  @Patch('/:postId')
  @UseGuards(AuthGuard('user-from-jwt'))
  async update(
    @Param('postId', ParseInt) postId: number,
    @Body() dto: PostsUpdateDto,
    @Req() req: any,
  ): Promise<PostEntity> {
    const expectedAuthorId = await this.postsService.findAuthorId(postId);

    if (expectedAuthorId !== req.user.id) {
      throw new UnauthorizedException();
    }

    dto.postId = postId;

    return this.postsService.update(dto);
  }
}
