import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { Unit } from '../units/entities/unit.entity';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async findAll() {
    return this.em.find(User, {}, { populate: ['unit', 'unit.universe'] });
  }

  async findOne(id: string) {
    const user = await this.em.findOne(User, { id }, { populate: ['unit', 'unit.universe'] });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(username: string, password: string, role: UserRole, unitId: string) {
    const unit = await this.em.findOne(Unit, { id: unitId });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${unitId} not found`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.em.create(User, {
      username,
      password: hashedPassword,
      role,
      unit
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: string, username?: string, password?: string, role?: UserRole) {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await this.em.flush();
    return user;
  }

  async remove(id: string) {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.em.removeAndFlush(user);
    return { deleted: true };
  }
}
