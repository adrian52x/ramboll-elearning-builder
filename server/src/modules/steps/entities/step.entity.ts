import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { ELearning } from '../../e-learnings/entities/e-learning.entity';
import { Block } from '../../blocks/entities/block.entity';
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

  @ManyToMany(() => Block, block => block.steps, { 
    owner: true,
    pivotEntity: () => StepBlock,
  })
  blocks = new Collection<Block>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
