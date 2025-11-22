import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, IsOptional, Min, ArrayMinSize } from 'class-validator';
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
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps!: CreateStepDto[];

  @IsArray()
  //@ArrayMinSize(1)
  @IsInt({ each: true })
  universeIds!: number[];
}

export class CreateStepDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  @Min(1)
  orderIndex!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BlockAssignmentDto)
  stepBlocks!: BlockAssignmentDto[];
}

export class BlockAssignmentDto {
  @IsOptional()
  @IsInt()
  existingBlockId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBlockDto)
  newBlock?: CreateBlockDto;

  @IsInt()
  @Min(1)
  orderIndex!: number;
}