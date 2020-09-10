import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfig from 'src/shared/configs/database.config';

import { FriendshipsModule } from 'src/modules/friendships/friendships.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), FriendshipsModule, UsersModule],
})
export class AppModule {}
