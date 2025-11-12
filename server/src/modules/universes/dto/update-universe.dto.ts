import { IsString, IsOptional } from 'class-validator';

export class UpdateUniverseDto {
  @IsString()
  @IsOptional()
  name?: string;
}
