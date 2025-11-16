import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  universe_id: number;
}
