import * as argon2 from 'argon2';
import * as validator from 'class-validator';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';

import { UserAuthenticationPayload } from 'src/shared/authentications/user/user.authentication.payload';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';

import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly model: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: UsersCreateDto): Promise<{ user: User; token: string }> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new ServerError(ServerErrorType.USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH);
    }

    const entity = this.model.build();

    entity.email = dto.email;
    entity.username = dto.username;
    entity.password = await argon2.hash(dto.password);
    entity.fullname = dto.fullname;
    entity.dateOfBirth = dto.dateOfBirth;
    entity.lastLoginDate = new Date();

    try {
      await entity.save();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          throw new ServerError(ServerErrorType.USER_EMAIL_IS_ALREADY_IN_USE, dto.email);
        } else if (error.errors[0].path === 'username') {
          throw new ServerError(ServerErrorType.USER_USERNAME_IS_ALREADY_IN_USE, dto.username);
        }
      }
      throw error;
    }

    entity.password = undefined;

    const payload: UserAuthenticationPayload = {
      id: entity.id,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: entity,
      token,
    };
  }

  async login(dto: UsersLoginDto): Promise<string> {
    const user = await this.model.findOne({
      where: { email: dto.email },
      attributes: ['id', 'email', 'password', 'lastLoginDate'],
    });

    if (!validator.isDefined(user)) {
      throw new ServerError(ServerErrorType.USER_TRIED_TO_LOGIN_WITH_WRONG_CREDENTIALS);
    }

    if ((await argon2.verify(user.password, dto.password)) === false) {
      throw new ServerError(ServerErrorType.USER_TRIED_TO_LOGIN_WITH_WRONG_CREDENTIALS);
    }

    user.lastLoginDate = new Date();
    await user.save();

    const payload: UserAuthenticationPayload = {
      id: user.id,
    };
    return this.jwtService.signAsync(payload);
  }

  async updatePassword(dto: UsersUpdatePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.newPasswordConfirmation) {
      throw new ServerError(ServerErrorType.USER_PASSWORD_CONFIRMATION_DOES_NOT_MATCH);
    }

    const user = await this.model.findOne({
      where: { id: dto.userId },
      attributes: ['id', 'password'],
    });

    if (!validator.isDefined(user)) {
      throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
    }

    if ((await argon2.verify(user.password, dto.currentPassword)) === false) {
      throw new ServerError(ServerErrorType.USER_CURRENT_PASSWORD_CONFIRMATION_DOES_NOT_MATCH);
    }

    user.password = await argon2.hash(dto.newPassword);
    await user.save();
  }
}
