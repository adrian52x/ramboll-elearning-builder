import { Entity, PrimaryKey, Property, OneToMany, Collection, OptionalProps } from '@mikro-orm/core';
import { Step } from '../../steps/entities/step.entity';
import { UniverseELearning } from '../../universe-e-learning/entities/universe-e-learning.entity';

@Entity({ tableName: 'e_learnings' })
export class ELearning {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Step, step => step.eLearning, { orphanRemoval: true })
  steps = new Collection<Step>(this);

  @OneToMany(() => UniverseELearning, (universeElearning) => universeElearning.eLearning, { orphanRemoval: true })
  universeElearnings = new Collection<UniverseELearning>(this);
  //universes = new Collection<UniverseELearning>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
