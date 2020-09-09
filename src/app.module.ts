import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfig from 'src/shared/configs/database.config';

import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), UsersModule],
})
export class AppModule {}
