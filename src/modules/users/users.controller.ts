import * as validator from 'class-validator';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersLookupDto } from 'src/modules/users/dto/users.lookup.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';
import { UsersUpdateProfileDto } from 'src/modules/users/dto/users.update-profile.dto';
import { UsersUpdateProfileImageDto } from 'src/modules/users/dto/users.update-profile-image.dto';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async lookup(@Query() dto: UsersLookupDto): Promise<User[]> {
    if (validator.isDefined(dto.emails)) {
      throw new UnauthorizedException();
    }

    if (validator.isDefined(dto.lastLoginDateRange)) {
      throw new UnauthorizedException();
    }

    if (validator.isDefined(dto.updatedAtRange)) {
      throw new UnauthorizedException();
    }

    if (validator.isDefined(dto.load)) {
      if (dto.load.includes('email')) {
        throw new UnauthorizedException();
      }
      if (dto.load.includes('lastLoginDate')) {
        throw new UnauthorizedException();
      }
      if (dto.load.includes('updatedAt')) {
        throw new UnauthorizedException();
      }
    } else {
      dto.load = this.usersService.loadableAttributes.join(',');
      dto.load.replace('email', '');
      dto.load.replace('lastLoginDate', '');
      dto.load.replace('updatedAt', '');
    }

    if (validator.isDefined(dto.order)) {
      if (dto.order.includes('email')) {
        throw new UnauthorizedException();
      }
      if (dto.order.includes('lastLoginDate')) {
        throw new UnauthorizedException();
      }
      if (dto.order.includes('updatedAt')) {
        throw new UnauthorizedException();
      }
    } else {
      dto.order = 'id';
    }

    return this.usersService.lookup(dto);
  }

  @Get('/@me')
  @UseGuards(AuthGuard('user-from-jwt'))
  async getCurrentUser(@Req() req: any): Promise<User> {
    return req.user;
  }

  @Post('/')
  async create(@Body() dto: UsersCreateDto): Promise<{ user: User; token: string }> {
    return this.usersService.create(dto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: UsersLoginDto): Promise<{ token: string }> {
    return this.usersService.login(dto);
  }

  @Patch('/@me')
  @UseGuards(AuthGuard('user-from-jwt'))
  async updateProfile(@Body() dto: UsersUpdateProfileDto, @Req() req: any): Promise<User> {
    if (validator.isDefined(dto.userId)) {
      throw new UnauthorizedException();
    }
    dto.userId = req.user.id;

    return this.usersService.updateProfile(dto);
  }

  @Patch('/@me/profile-image')
  @UseGuards(AuthGuard('user-from-jwt'))
  async updateProfileImage(
    @Body() dto: UsersUpdateProfileImageDto,
    @Req() req: any,
  ): Promise<string> {
    if (validator.isDefined(dto.user)) {
      throw new UnauthorizedException();
    }
    dto.user = req.user;

    return this.usersService.updateProfileImage(dto);
  }

  @Patch('/@me/password')
  @UseGuards(AuthGuard('user-from-jwt'))
  async updatePassword(@Body() dto: UsersUpdatePasswordDto, @Req() req: any): Promise<void> {
    if (validator.isDefined(dto.userId)) {
      throw new UnauthorizedException();
    }
    dto.userId = req.user.id;

    return this.usersService.updatePassword(dto);
  }
}
