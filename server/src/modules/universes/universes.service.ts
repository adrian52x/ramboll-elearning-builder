import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Universe } from './entities/universe.entity';

@Injectable()
export class UniversesService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Universe[]> {
    return this.em.find(Universe, {});
  }

  async findOne(id: number): Promise<Universe> {
    return this.em.findOneOrFail(Universe, { id }, { populate: ['units'] });
  }

  async create(name: string): Promise<Universe> {
    const universe = this.em.create(Universe, { name });
    await this.em.persistAndFlush(universe);
    return universe;
  }

  async update(id: number, name: string): Promise<Universe> {
    const universe = await this.em.findOneOrFail(Universe, { id });
    universe.name = name;
    await this.em.flush();
    return universe;
  }

  async remove(id: number): Promise<void> {
    const universe = await this.em.findOneOrFail(Universe, { id });
    await this.em.removeAndFlush(universe);
  }
}
