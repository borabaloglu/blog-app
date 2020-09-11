import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostTagsController } from 'src/modules/post-tags/post-tags.controller';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';

import { PostTagsService } from 'src/modules/post-tags/post-tags.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostTag, Tag])],
  providers: [PostTagsService],
  controllers: [PostTagsController],
})
export class PostTagsModule {}
