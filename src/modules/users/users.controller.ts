import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';

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
}
