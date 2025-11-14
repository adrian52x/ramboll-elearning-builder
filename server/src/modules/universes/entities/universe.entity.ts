import { Entity, PrimaryKey, Property, Collection, OneToMany, OptionalProps } from '@mikro-orm/core';
import { Unit } from '../../units/entities/unit.entity';

@Entity({ tableName: 'universes' })
export class Universe {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Unit, (unit) => unit.universe, { orphanRemoval: true })
  units = new Collection<Unit>(this);
}
