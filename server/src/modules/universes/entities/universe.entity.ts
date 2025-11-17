import { Entity, PrimaryKey, Property, Collection, OneToMany, OptionalProps } from '@mikro-orm/core';
import { Unit } from '../../units/entities/unit.entity';
import { UniverseELearning } from '../../universe-e-learning/entities/universe-e-learning.entity';

@Entity({ tableName: 'universes' })
export class Universe {
  //[OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToMany(() => Unit, (unit) => unit.universe, { orphanRemoval: true })
  units = new Collection<Unit>(this);

  @OneToMany(() => UniverseELearning, (universeElearning) => universeElearning.universe)
  universeElearnings = new Collection<UniverseELearning>(this);

  // @Property()
  // createdAt: Date = new Date();

  // @Property({ onUpdate: () => new Date() })
  // updatedAt: Date = new Date();
}
