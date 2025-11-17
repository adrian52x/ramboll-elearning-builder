/**
 * MikroORM Configuration
 * 
 * Used by:
 * 1. CLI commands (migrations, seeding, schema operations)
 * 2. NestJS application (imported in app.module.ts)
 * 
 * The CLI auto-discovers this file by name: mikro-orm.config.ts
 */

import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  // Database connection
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'dev',
  password: process.env.DB_PASSWORD || 'dev',
  dbName: process.env.DB_NAME || 'ramboll-elearning',

  // Entity discovery - CLI uses .js (compiled), NestJS uses .ts
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  // Metadata provider for reflection (reads TypeScript decorators)
  metadataProvider: TsMorphMetadataProvider,

  // Automatically throw NestJS NotFoundException when entity not found
  // Used by em.findOneOrFail(), repository.findOneOrFail(), etc.
  findOneOrFailHandler: (entityName: string, where: any) => {
    return new NotFoundException(`${entityName} not found`);
  },

  // Show SQL queries in console during development
  //debug: process.env.NODE_ENV === 'development',

  // Migration settings
  migrations: {
    path: 'dist/database/migrations',      // Compiled migration files
    pathTs: 'src/database/migrations',     // Source migration files
    tableName: 'mikro_orm_migrations',     // Track applied migrations
    transactional: true,                   // Wrap in transaction
  },

  // Seeder settings (for npm run seed)
  seeder: {
    path: 'dist/database/seeders',         // Compiled seeder files
    pathTs: 'src/database/seeders',        // Source seeder files
    defaultSeeder: 'DatabaseSeeder',       // Default seeder class name
    glob: '!(*.d).{js,ts}',                // Ignore .d.ts files
    emit: 'ts',                            // Generate TypeScript seeders
  },
});
