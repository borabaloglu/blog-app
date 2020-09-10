import { Module } from '@nestjs/common';

import { PostsController } from 'src/modules/posts/posts.controller';

import { PostsService } from 'src/modules/posts/posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
