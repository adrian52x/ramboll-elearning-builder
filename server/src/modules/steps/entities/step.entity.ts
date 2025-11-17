import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, OptionalProps, Unique } from '@mikro-orm/core';
import { ELearning } from '../../e-learnings/entities/e-learning.entity';
import { StepBlock } from '../../step-blocks/entities/step-block.entity';

@Entity({ tableName: 'steps' })
@Unique({ properties: ['eLearning', 'orderIndex'] }) // Each e-learning must have unique step order indexes
export class Step {
  //[OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => ELearning, { fieldName: 'e_learning_id', hidden: true })
  eLearning!: ELearning;

  @Property()
  orderIndex!: number;

  @Property()
  title!: string;

  @OneToMany(() => StepBlock, stepBlock => stepBlock.step)
  stepBlocks = new Collection<StepBlock>(this);

  // @Property({ onCreate: () => new Date() })
  // createdAt: Date = new Date();

  // @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  // updatedAt: Date = new Date();
}
