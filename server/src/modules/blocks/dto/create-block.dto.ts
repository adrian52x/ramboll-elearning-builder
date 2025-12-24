import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, ValidateNested, IsArray, IsUrl, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { BlockType } from '../entities/block.entity';

export class CreateBlockDto {
  @IsEnum(BlockType)
  type!: BlockType;

  @IsString()
  @IsNotEmpty()
  headline!: string;

  @IsString()
  @IsOptional()
  description?: string;

  // ========== VIDEO BLOCK FIELDS ==========
  @ValidateIf(o => o.type === BlockType.VIDEO)
  @IsString()
  @IsNotEmpty()
  videoUrl?: string;

  // ========== IMAGE BLOCK FIELDS ==========
  @ValidateIf(o => o.type === BlockType.IMAGE)
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  // ========== INTERACTIVE TABS FIELDS ==========
  @ValidateIf(o => o.type === BlockType.INTERACTIVE_TABS)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TabDto)
  tabs?: TabDto[];

  // ========== FLIP CARDS FIELDS ==========
  @ValidateIf(o => o.type === BlockType.FLIP_CARDS)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];

  // ========== FEEDBACK ACTIVITY FIELDS ==========
  @ValidateIf(o => o.type === BlockType.FEEDBACK_ACTIVITY)
  @IsString()
  @IsNotEmpty()
  question?: string;
}

// Supporting DTOs for nested validation
class TabDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  contentUrl!: string;
}

class CardDto {
  @IsString()
  @IsNotEmpty()
  front!: string;

  @IsString()
  @IsNotEmpty()
  back!: string;
}
