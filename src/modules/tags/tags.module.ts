import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TagsController } from 'src/modules/tags/tags.controller';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/posts/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';

import { TagsService } from 'src/modules/tags/tags.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostTag, Tag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
