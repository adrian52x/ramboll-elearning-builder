import { IsNotEmpty, IsString, IsEnum, IsInt } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsInt()
  @IsNotEmpty()
  unit_id: number;
}
