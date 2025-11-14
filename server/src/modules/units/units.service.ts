import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Unit } from './entities/unit.entity';
import { Universe } from '../universes/entities/universe.entity';

@Injectable()
export class UnitsService {
  constructor(private readonly em: EntityManager) {}

  async findAll() {
    return this.em.find(Unit, {}, { populate: ['universe'] });
  }

  async findOne(id: number) {
    const unit = await this.em.findOne(Unit, { id }, { populate: ['universe', 'users'] });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }
    return unit;
  }

  async create(name: string, universeId: number) {
    const universe = await this.em.findOne(Universe, { id: universeId });
    if (!universe) {
      throw new NotFoundException(`Universe with id ${universeId} not found`);
    }

    const unit = this.em.create(Unit, {
      name,
      universe
    });
    await this.em.persistAndFlush(unit);
    return unit;
  }

  async update(id: number, name: string) {
    const unit = await this.em.findOne(Unit, { id });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }

    unit.name = name;
    await this.em.flush();
    return unit;
  }

  async remove(id: number) {
    const unit = await this.em.findOne(Unit, { id });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }

    await this.em.removeAndFlush(unit);
    return { deleted: true };
  }
}
