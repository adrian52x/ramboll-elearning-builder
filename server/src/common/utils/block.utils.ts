import { BadRequestException } from '@nestjs/common';
import { BlockType } from '../../modules/blocks/entities/block.entity';
import { CreateBlockDto } from '../../modules/blocks/dto/create-block.dto';

export function buildBlockContent(blockDto: CreateBlockDto): Record<string, any> {
  switch (blockDto.type) {
    case BlockType.VIDEO:
      return { video_url: blockDto.video_url };

    case BlockType.IMAGE:
      return { image_urls: blockDto.image_urls };

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
