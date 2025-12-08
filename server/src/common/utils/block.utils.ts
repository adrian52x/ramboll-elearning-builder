import { BadRequestException } from '@nestjs/common';
import { BlockType } from '../../modules/blocks/entities/block.entity';
import { CreateBlockDto } from '../../modules/blocks/dto/create-block.dto';

export function buildBlockContent(blockDto: CreateBlockDto): Record<string, any> {
  switch (blockDto.type) {
    case BlockType.VIDEO:
      return { videoUrl: blockDto.videoUrl };

    case BlockType.IMAGE:
      return { imageUrls: blockDto.imageUrls };

    case BlockType.INTERACTIVE_TABS:
      return { tabs: blockDto.tabs };

    case BlockType.FLIP_CARDS:
      return { cards: blockDto.cards };

    case BlockType.FEEDBACK_ACTIVITY:
      return { question: blockDto.question };

    default:
      throw new BadRequestException(`Unknown block type: ${blockDto.type}`);
  }
}
