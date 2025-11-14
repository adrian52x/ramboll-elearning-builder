import { Entity, PrimaryKey, Property, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { Universe } from '../../universes/entities/universe.entity';
import { ELearning } from '../../e-learnings/entities/e-learning.entity';

@Entity({ tableName: 'e_learning_assignments' })
export class ELearningAssignment {
  [OptionalProps]?: 'assignedAt';

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Universe, { fieldName: 'universe_id' })
  universe!: Universe;

  @ManyToOne(() => ELearning, { fieldName: 'e_learning_id' })
  eLearning!: ELearning;

  @Property({ onCreate: () => new Date() })
  assignedAt: Date = new Date();
}
