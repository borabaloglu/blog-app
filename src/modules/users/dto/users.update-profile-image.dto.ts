import { Exclude } from 'class-transformer';
import { IsInstance, IsOptional } from 'class-validator';

import { User } from 'src/modules/users/entities/user.entity';

export class UsersUpdateProfileImageDto {
  @Exclude()
  media: any;

  @IsOptional()
  @IsInstance(User)
  user?: User;
}
