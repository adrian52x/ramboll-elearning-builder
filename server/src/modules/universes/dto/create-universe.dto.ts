import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUniverseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
