import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfig from 'src/shared/configs/database.config';

import { FriendshipsModule } from 'src/modules/friendships/friendships.module';
import { PostsModule } from 'src/modules/posts/posts.module';
import { PostTagsModule } from 'src/modules/post-tags/post-tags.module';
import { TagsModule } from 'src/modules/tags/tags.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    FriendshipsModule,
    PostsModule,
    PostTagsModule,
    TagsModule,
    UsersModule,
  ],
})
export class AppModule {}
