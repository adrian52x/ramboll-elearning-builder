import { Entity, PrimaryKey, Property, ManyToOne, Enum, OptionalProps } from '@mikro-orm/core';
import { Unit } from '../../units/entities/unit.entity';

export enum UserRole {
  USER = 'user',
  INCEPT_ADMIN = 'incept-admin',
}

@Entity({ tableName: 'users' })
export class User {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @ManyToOne(() => Unit)
  unit!: Unit;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
