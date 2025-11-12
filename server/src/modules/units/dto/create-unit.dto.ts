import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  universe_id: string;
}
