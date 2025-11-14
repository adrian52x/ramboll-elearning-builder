import { Entity, PrimaryKey, Property, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Step } from '../../steps/entities/step.entity';

@Entity({ tableName: 'e_learnings' })
export class ELearning {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Step, step => step.eLearning, { orphanRemoval: true })
  steps = new Collection<Step>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
