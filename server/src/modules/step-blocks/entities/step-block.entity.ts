import { Entity, PrimaryKey, Property, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { Step } from '../../steps/entities/step.entity';
import { Block } from '../../blocks/entities/block.entity';

/**
 * Junction table for Step-Block ManyToMany relationship
 * Stores the order of blocks within each step
 */
@Entity({ tableName: 'step_blocks' })
export class StepBlock {
  [OptionalProps]?: 'createdAt';

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Step, { fieldName: 'step_id' })
  step!: Step;

  @ManyToOne(() => Block, { fieldName: 'block_id' })
  block!: Block;

  @Property()
  orderIndex!: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
