import { Entity, PrimaryKey, Property, ManyToOne, Collection, OneToMany, OptionalProps } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Universe } from '../../universes/entities/universe.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'units' })
export class Unit {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name!: string;

  @ManyToOne(() => Universe)
  universe!: Universe;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => User, (user) => user.unit, { orphanRemoval: true })
  users = new Collection<User>(this);
}
