import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FriendshipsUnfollowDto {
  @Transform((value: string) => +value)
  @IsInt()
  @Min(1)
  followingId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  followerId?: number;
}
