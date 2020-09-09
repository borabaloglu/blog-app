import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from 'src/modules/users/users.controller';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
