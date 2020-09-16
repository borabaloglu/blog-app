import { IsBase64, IsInstance, IsOptional } from 'class-validator';

import { User } from 'src/modules/users/entities/user.entity';

export class UsersUpdateProfileImageDto {
  @IsBase64()
  profileImage: string;

  @IsOptional()
  @IsInstance(User)
  user?: User;
}
