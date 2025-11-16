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

  @IsNumber()
  orderIndex!: number;

  // ========== VIDEO BLOCK FIELDS ==========
  @ValidateIf(o => o.type === BlockType.VIDEO)
  @IsUrl()
  @IsNotEmpty()
  video_url?: string;

  // ========== IMAGE BLOCK FIELDS ==========
  @ValidateIf(o => o.type === BlockType.IMAGE)
  @IsArray()
  @IsUrl({}, { each: true })
  image_urls?: string[];

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
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  @IsNotEmpty()
  content_url!: string;
}

class CardDto {
  @IsString()
  @IsNotEmpty()
  front!: string;

  @IsString()
  @IsNotEmpty()
  back!: string;
}
