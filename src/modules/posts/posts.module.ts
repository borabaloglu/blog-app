import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserAuthenticationStrategy } from 'src/shared/authentications/user/user.authentication.strategy';

import { PostsController } from 'src/modules/posts/posts.controller';

import { Post } from 'src/modules/posts/entities/post.entity';
import { PostTag } from 'src/modules/post-tags/entities/post-tag.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { PostTagsModule } from 'src/modules/post-tags/post-tags.module';
import { TagsModule } from 'src/modules/tags/tags.module';

import { PostsService } from 'src/modules/posts/posts.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostTag, Tag, User]), PostTagsModule, TagsModule],
  controllers: [PostsController],
  providers: [UserAuthenticationStrategy, PostsService],
})
export class PostsModule {}
