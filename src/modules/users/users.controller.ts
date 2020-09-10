import * as validator from 'class-validator';

import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';
import { UsersUpdateProfileDto } from 'src/modules/users/dto/users.update-profile.dto';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(@Body() dto: UsersCreateDto): Promise<{ user: User; token: string }> {
    return this.usersService.create(dto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: UsersLoginDto): Promise<string> {
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
