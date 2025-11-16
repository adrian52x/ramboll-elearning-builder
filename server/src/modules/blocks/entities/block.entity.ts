import { Entity, PrimaryKey, Property, OneToMany, Collection, Enum, OptionalProps } from '@mikro-orm/core';
import { StepBlock } from '../../step-blocks/entities/step-block.entity';

export enum BlockType {
  VIDEO = 'video',
  IMAGE = 'image',
  INTERACTIVE_TABS = 'interactive_tabs',
  FLIP_CARDS = 'flip_cards',
  FEEDBACK_ACTIVITY = 'feedback_activity',
}

@Entity({ tableName: 'blocks' })
export class Block {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @OneToMany(() => StepBlock, stepBlock => stepBlock.block)
  stepBlocks = new Collection<StepBlock>(this);

  @Enum(() => BlockType)
  type!: BlockType;

  @Property()
  headline!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  /**
   * Type-specific content stored as JSON
   * 
   * Examples:
   * - VIDEO: { video_url: string }
   * - IMAGE: { image_urls: string[] }
   * - INTERACTIVE_TABS: { tabs: Array<{ title, description, content_url }> }
   * - FLIP_CARDS: { cards: Array<{ front, back }> }
   * - FEEDBACK_ACTIVITY: { question }
   */
  @Property({ type: 'json' })
  content!: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
