import { Entity, PrimaryKey, Property, ManyToOne, OptionalProps, Unique, Index } from '@mikro-orm/core';
import { Step } from '../../steps/entities/step.entity';
import { Block } from '../../blocks/entities/block.entity';

/**
 * Junction table for Step-Block ManyToMany relationship
 * Stores the order of blocks within each step
 */
@Entity({ tableName: 'step_blocks' })
@Unique({ properties: ['step', 'block'] }) // A block can only appear once per step -- composite unique constraint on multiple columns.
@Unique({ properties: ['step', 'orderIndex'] }) // Each step must have unique order indexes
export class StepBlock {
  //[OptionalProps]?: 'createdAt';

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Step, { fieldName: 'step_id', hidden: true }) // Won't appear in JSON output
  step!: Step;

  @ManyToOne(() => Block, { fieldName: 'block_id', hidden: false }) // Will appear in JSON output
  block!: Block;

  @Property()
  orderIndex!: number;

  // @Property({ onCreate: () => new Date() })
  // createdAt: Date = new Date();
}
