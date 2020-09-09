import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import securityConfig from 'src/shared/configs/security.config';

import { UsersController } from 'src/modules/users/users.controller';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    JwtModule.register({ secret: securityConfig.jwt.secret }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
