import * as validator from 'class-validator';

import { Controller, Post, UseGuards, Req, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PostsCreateDto } from 'src/modules/posts/dto/posts.create.dto';

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
}
