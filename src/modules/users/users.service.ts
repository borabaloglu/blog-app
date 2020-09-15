import * as argon2 from 'argon2';
import * as validator from 'class-validator';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { promises as fs } from 'fs';
import { Op, Sequelize, Transaction } from 'sequelize';

import securityConfig from 'src/shared/configs/security.config';
import urlConfig from 'src/shared/configs/url.config';
import fileHelper from 'src/shared/helpers/file.helper';
import lookupHelper from 'src/shared/helpers/lookup.helper';

import { UserAuthenticationPayload } from 'src/shared/authentications/user/user.authentication.payload';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersLookupDto } from 'src/modules/users/dto/users.lookup.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';
import { UsersUpdateProfileDto } from 'src/modules/users/dto/users.update-profile.dto';
import { UsersUpdateProfileImageDto } from 'src/modules/users/dto/users.update-profile-image.dto';

import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  readonly orderableAttributes = [
    'id',
    'username',
    'fullname',
    'dateOfBirth',
    'lastLoginDate',
    'createdAt',
    'updatedAt',
  ];
  readonly loadableAttributes = ['biography', 'profileImageUrl', ...this.orderableAttributes];

  constructor(
    @InjectModel(User) private readonly model: typeof User,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
  ) {}

  async lookup(dto: UsersLookupDto, transaction?: Transaction): Promise<User[]> {
    const query: any = {};

    {
      const where: any = {};

      if (validator.isDefined(dto.userIds)) {
        where.id = dto.userIds;
      }

      if (validator.isDefined(dto.emails)) {
        where.email = {
          [Op.iLike]: {
            [Op.any]: dto.emails.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.usernames)) {
        where.username = {
          [Op.iLike]: {
            [Op.any]: dto.usernames.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.fullnames)) {
        where.fullname = {
          [Op.iLike]: {
            [Op.any]: dto.fullnames.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.biographies)) {
        where.biography = {
          [Op.iLike]: {
            [Op.any]: dto.biographies.map(item => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.dateOfBirthRange)) {
        where.dateOfBirth = lookupHelper.generateRangeQuery(dto.dateOfBirthRange);
      }

      if (validator.isDefined(dto.lastLoginDateRange)) {
        where.lastLoginDate = lookupHelper.generateRangeQuery(dto.lastLoginDateRange);
      }

      if (validator.isDefined(dto.createdAtRange)) {
        where.createdAt = lookupHelper.generateRangeQuery(dto.createdAtRange);
      }

      if (validator.isDefined(dto.updatedAtRange)) {
        where.updatedAt = lookupHelper.generateRangeQuery(dto.updatedAtRange);
      }

      if (validator.isDefined(dto.search)) {
        where[Op.or] = [
          {
            username: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
          {
            fullname: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
          {
            biography: {
              [Op.iLike]: {
                [Op.any]: dto.search.map(item => `%${item}%`),
              },
            },
          },
        ];
      }

      query.where = where;
    }

    if (validator.isDefined(dto.order)) {
      query.order = lookupHelper.transformOrder(dto.order, this.orderableAttributes);
    }

    if (validator.isDefined(dto.load)) {
      query.attributes = lookupHelper.transformLoad(dto.load, this.loadableAttributes);
    }

    if (validator.isDefined(dto.page)) {
      const { offset, limit } = lookupHelper.transformPage(dto.page);
      query.offset = offset;
      query.limit = limit;
    }

    if (validator.isDefined(transaction)) {
      query.transaction = transaction;
    }

    return this.model.findAll(query);
  }

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

  async updateProfile(dto: UsersUpdateProfileDto): Promise<User> {
    const updates: any = {};

    if (validator.isDefined(dto.username)) {
      updates.username = dto.username;
    }

    if (validator.isDefined(dto.fullname)) {
      updates.fullname = dto.fullname;
    }
    if (validator.isDefined(dto.biography)) {
      updates.biography = dto.biography;
    }
    if (validator.isDefined(dto.dateOfBirth)) {
      updates.dateOfBirth = dto.dateOfBirth;
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    let result: [number, User[]];
    try {
      result = await this.model.update(updates, {
        where: {
          id: dto.userId,
        },
        returning: true,
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'username') {
          throw new ServerError(ServerErrorType.USER_USERNAME_IS_ALREADY_IN_USE, dto.username);
        }
      }
      throw error;
    }

    if (result[0] !== 1) {
      throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
    }

    result[1][0].password = undefined;

    return result[1][0];
  }

  async updateProfileImage(dto: UsersUpdateProfileImageDto): Promise<string> {
    fileHelper.validateFileInformation(dto.media, ['image']);

    const filename = `${crypto
      .createHash(securityConfig.crypto.hashAlgorithm)
      .update(`${dto.user.id}.${dto.user.createdAt}`)
      .digest('hex')}.png`;

    const newProfileImageUrl = `${urlConfig.static.profileImage}/${filename}`;

    return this.sequelize.transaction(async transaction => {
      const result = await this.model.update(
        {
          profileImageUrl: newProfileImageUrl,
        },
        {
          where: {
            id: dto.user.id,
          },
          transaction,
        },
      );

      if (result[0] !== 1) {
        throw new ServerError(ServerErrorType.RECORD_IS_MISSING);
      }

      const mediaBuffer = await dto.media.toBuffer();
      await fs.writeFile(`public/profile-images/${filename}`, mediaBuffer);

      return newProfileImageUrl;
    });
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
