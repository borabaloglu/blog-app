import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FriendshipsFollowDto {
  @Transform((value: string) => +value)
  @IsInt()
  @Min(1)
  followingId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  followerId?: number;
}
