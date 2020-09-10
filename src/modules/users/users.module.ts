import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import securityConfig from 'src/shared/configs/security.config';

import { UserAuthenticationStrategy } from 'src/shared/authentications/user/user.authentication.strategy';

import { UsersController } from 'src/modules/users/users.controller';

import { Friendship } from 'src/modules/friendships/entities/friendship.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    JwtModule.register({ secret: securityConfig.jwt.secret }),
    PassportModule.register({}),
    SequelizeModule.forFeature([Friendship, User]),
  ],
  controllers: [UsersController],
  providers: [UserAuthenticationStrategy, UsersService],
})
export class UsersModule {}
