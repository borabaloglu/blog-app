import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UsersUpdatePasswordDto {
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  currentPassword: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  newPassword: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/)
  newPasswordConfirmation: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
