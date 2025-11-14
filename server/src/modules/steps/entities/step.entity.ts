import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ELearning } from '../../e-learnings/entities/e-learning.entity';
import { Block } from '../../blocks/entities/block.entity';

@Entity({ tableName: 'steps' })
export class Step {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => ELearning, { fieldName: 'e_learning_id' })
  eLearning!: ELearning;

  @Property()
  title!: string;

  @Property()
  orderIndex!: number;

  @ManyToMany(() => Block, block => block.steps, { owner: true })
  blocks = new Collection<Block>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
