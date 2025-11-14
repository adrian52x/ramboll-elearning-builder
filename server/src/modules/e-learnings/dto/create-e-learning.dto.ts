import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBlockDto } from '../../blocks/dto/create-block.dto';


export class CreateELearningDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps!: CreateStepDto[];

  @IsArray()
  @IsInt({ each: true })
  universeIds!: number[];
}

export class CreateStepDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  orderIndex!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockAssignmentDto)
  blocks!: BlockAssignmentDto[];
}

export class BlockAssignmentDto {
  @IsOptional()
  @IsInt()
  existingBlockId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBlockDto)
  newBlock?: CreateBlockDto;

  @IsNumber()
  orderIndex!: number;
}