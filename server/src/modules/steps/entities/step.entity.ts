import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { ELearning } from '../../e-learnings/entities/e-learning.entity';
import { StepBlock } from '../../step-blocks/entities/step-block.entity';

@Entity({ tableName: 'steps' })
export class Step {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => ELearning, { fieldName: 'e_learning_id' })
  eLearning!: ELearning;

  @Property()
  title!: string;

  @Property()
  orderIndex!: number;

  @OneToMany(() => StepBlock, stepBlock => stepBlock.step)
  stepBlocks = new Collection<StepBlock>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
