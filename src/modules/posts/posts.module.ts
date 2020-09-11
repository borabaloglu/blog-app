import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostsController } from 'src/modules/posts/posts.controller';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/posts/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { PostsService } from 'src/modules/posts/posts.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostTag, Tag, User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
