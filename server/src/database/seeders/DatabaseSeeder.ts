import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Universe } from '../../modules/universes/entities/universe.entity';
import { Unit } from '../../modules/units/entities/unit.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create Universes
    const inceptUniverse = em.create(Universe, {
      name: 'Incept Universe',
    });

    const clientUniverse = em.create(Universe, {
      name: 'Client Universe',
    });

    // Create Units for Incept Universe
    const inceptHQ = em.create(Unit, {
      name: 'Incept HQ',
      universe: inceptUniverse,
    });

    const inceptDev = em.create(Unit, {
      name: 'Incept Development',
      universe: inceptUniverse,
    });

    // Create Units for Client Universe
    const clientCompanyA = em.create(Unit, {
      name: 'Company A',
      universe: clientUniverse,
    });

    const clientCompanyB = em.create(Unit, {
      name: 'Company B',
      universe: clientUniverse,
    });

    // Create Users
    const adminUser = em.create(User, {
      username: 'admin@incept.dk',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.INCEPT_ADMIN,
      unit: inceptHQ,
    });

    const devUser = em.create(User, {
      username: 'developer@incept.dk',
      password: await bcrypt.hash('dev123', 10),
      role: UserRole.INCEPT_ADMIN,
      unit: inceptDev,
    });

    const clientUserA = em.create(User, {
      username: 'user@companya.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      unit: clientCompanyA,
    });

    const clientUserB = em.create(User, {
      username: 'user@companyb.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      unit: clientCompanyB,
    });

    // Persist all entities in a single transaction
    await em.persistAndFlush([
      inceptUniverse,
      clientUniverse,
      inceptHQ,
      inceptDev,
      clientCompanyA,
      clientCompanyB,
      adminUser,
      devUser,
      clientUserA,
      clientUserB,
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('---');
    console.log('Created 2 universes:');
    console.log('  - Incept Universe (with Incept HQ, Incept Development)');
    console.log('  - Client Universe (with Company A, Company B)');
    console.log('---');
    console.log('Created 4 users:');
    console.log('  - admin@incept.dk / admin123 (Incept Admin)');
    console.log('  - developer@incept.dk / dev123 (Incept Admin)');
    console.log('  - user@companya.com / user123 (Regular User)');
    console.log('  - user@companyb.com / user123 (Regular User)');
  }
}
