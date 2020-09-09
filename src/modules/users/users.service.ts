import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';

import { UserAuthenticationPayload } from 'src/shared/authentications/user/user.authentication.payload';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';

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
}
