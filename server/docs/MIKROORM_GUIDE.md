# MikroORM Migration Guide

## Overview

This project has been migrated from TypeORM to MikroORM. This document explains the setup and how to use MikroORM features.

## Entity Structure

### Universe → Unit → User

- **Universe**: Top-level entity representing a group of companies
- **Unit**: Individual company within a universe
- **User**: User belonging to a unit with role-based access (`user` or `incept-admin`)

### Key Features

- **UUID Primary Keys**: All entities use UUIDs generated with `v4()`
- **Timestamps**: `createdAt` and `updatedAt` are automatically managed
- **Relations**: Bidirectional relationships with proper cascade behavior
- **Password Hashing**: User passwords are hashed with bcrypt (10 rounds)
- **Hidden Fields**: Password field is hidden from JSON serialization

## Available Scripts

### Migrations

```powershell
# Create a new migration (after entity changes)
npm run migration:create

# Run pending migrations
npm run migration:up

# Revert last migration
npm run migration:down

# List all migrations
npm run migration:list

# Show pending migrations
npm run migration:pending
```

npm run migration:fresh  # Drop all tables and re-run migrations
npm run seed            # Then seed clean database

### Database Schema

```powershell
# Create database schema from entities
npm run schema:create

# Drop all tables
npm run schema:drop

# Update schema (sync entities with database - use carefully!)
npm run schema:update
```

### Seeding

```powershell
# Run the database seeder
npm run seed
```

The seeder (`src/database/seeders/DatabaseSeeder.ts`) creates:
- 2 universes (Incept Universe, Client Universe)
- 4 units (Incept HQ, Incept Development, Company A, Company B)
- 4 users with different roles

**Test Credentials:**
- `admin@incept.dk` / `admin123` (Incept Admin)
- `developer@incept.dk` / `dev123` (Incept Admin)
- `user@companya.com` / `user123` (User)
- `user@companyb.com` / `user123` (User)

## Quick Start

### 1. Start PostgreSQL

```powershell
docker-compose up -d postgres
```

### 2. Create Database Schema

**For development (quick setup):**
```powershell
npm run schema:create
```

**For production (migration approach):**
```powershell
npm run migration:create -- --initial
npm run migration:up
```

**Which to use?**
- Use `schema:create` during development for quick iteration
- Use migrations for production and team collaboration (tracks version history)

### 3. Seed the Database

```powershell
npm run seed
```

### 4. Start the Development Server

```powershell
npm run start:dev
```

## API Endpoints

### Universes

- `GET /universes` - List all universes
- `GET /universes/:id` - Get single universe with units
- `POST /universes` - Create universe
  ```json
  { "name": "Universe Name" }
  ```
- `PATCH /universes/:id` - Update universe
  ```json
  { "name": "New Name" }
  ```
- `DELETE /universes/:id` - Delete universe

### Units

- `GET /units` - List all units with universe
- `GET /units/:id` - Get single unit with universe and users
- `POST /units` - Create unit
  ```json
  {
    "name": "Unit Name",
    "universe_id": "uuid-here"
  }
  ```
- `PATCH /units/:id` - Update unit
  ```json
  { "name": "New Name" }
  ```
- `DELETE /units/:id` - Delete unit

### Users

- `GET /users` - List all users with unit and universe
- `GET /users/:id` - Get single user
- `POST /users` - Create user
  ```json
  {
    "username": "user@example.com",
    "password": "password123",
    "role": "user",
    "unit_id": "uuid-here"
  }
  ```
- `PATCH /users/:id` - Update user
  ```json
  {
    "username": "newname@example.com",
    "password": "newpassword",
    "role": "incept-admin"
  }
  ```
- `DELETE /users/:id` - Delete user

## MikroORM Patterns

### Service Layer Example

```typescript
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  constructor(private readonly em: EntityManager) {}

  // Find all with relations
  async findAll() {
    return this.em.find(Entity, {}, { populate: ['relation'] });
  }

  // Find one by ID - throws NotFoundException automatically if not found
  async findOne(id: string) {
    return this.em.findOneOrFail(Entity, { id }, { populate: ['relation'] });
  }

  // Create new entity
  async create(data: any) {
    const entity = this.em.create(Entity, data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  // Update entity (automatic change tracking)
  async update(id: string, data: any) {
    const entity = await this.em.findOneOrFail(Entity, { id });
    
    Object.assign(entity, data);
    await this.em.flush(); // Automatically detects changes
    return entity;
  }

  // Delete entity
  async remove(id: string) {
    const entity = await this.em.findOneOrFail(Entity, { id });
    await this.em.removeAndFlush(entity);
  }
}
```

### Why `findOneOrFail`?

Using `findOneOrFail` instead of `findOne` provides:
- **Automatic exceptions**: Throws `NotFoundException` if entity not found
- **Cleaner code**: No manual `if (!entity) throw...` checks
- **Better types**: Return type is `Entity` instead of `Entity | null`
- **NestJS integration**: Automatically returns HTTP 404 responses

**Before:**
```typescript
async findOne(id: string): Promise<Entity | null> {
  const entity = await this.em.findOne(Entity, { id });
  if (!entity) {
    throw new NotFoundException(`Entity with id ${id} not found`);
  }
  return entity;
}
```

**After:**
```typescript
async findOne(id: string): Promise<Entity> {
  return this.em.findOneOrFail(Entity, { id });
  // NotFoundException thrown automatically if not found!
}
```
    
    Object.assign(entity, data);
    await this.em.flush(); // Automatically detects changes
    return entity;
  }

  // Delete entity
  async remove(id: string) {
    const entity = await this.em.findOne(Entity, { id });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    
    await this.em.removeAndFlush(entity);
    return { deleted: true };
  }
}
```

### Key Differences from TypeORM

1. **Unit of Work**: MikroORM uses a Unit of Work pattern - changes are tracked automatically
2. **flush() vs save()**: Call `em.flush()` to persist all tracked changes
3. **persistAndFlush()**: Marks entity for insertion and immediately flushes
4. **removeAndFlush()**: Marks entity for deletion and immediately flushes
5. **populate**: Use `populate` option instead of `relations` for eager loading
6. **findOneOrFail**: Automatically throws exceptions when entity not found

## Configuration

### Database Connection

Edit `.env` file:

```env
# Use 'localhost' for local development
# Use 'postgres' when running backend in Docker
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=dev
DB_NAME=ramboll-elearning
NODE_ENV=development
```

### MikroORM Config Files

**Single config file:** `mikro-orm.config.ts` (root level)

This file is used by:
1. **CLI commands** - Auto-discovered by name when running `npm run seed`, `npm run migration:create`, etc.
2. **NestJS application** - Imported in `app.module.ts`

**Key configuration options:**
- `findOneOrFailHandler` - Automatically throws `NotFoundException` when entity not found
- `entities` / `entitiesTs` - Paths for compiled (.js) and source (.ts) entity files
- `metadataProvider` - Uses `TsMorphMetadataProvider` to read TypeScript decorators
- `debug` - Shows SQL queries in console during development
- `migrations` - Configuration for database migrations
- `seeder` - Configuration for database seeding

## Troubleshooting

### Database Connection Errors

**Error:** `password authentication failed for user "postgres"`

**Solution:** Check that your `.env` file matches your docker-compose settings:
- `.env` uses `DB_USERNAME` (not `DB_USER`)
- Ensure credentials match: default is `dev` / `dev`

### Migration Issues

If you have issues with migrations, you can reset the database:

```powershell
npm run schema:drop
npm run schema:create
npm run seed
```

### Type Errors in Entities

Make sure you're using `OptionalProps` for fields with default values:

```typescript
import { Entity, OptionalProps } from '@mikro-orm/core';

@Entity()
export class MyEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
  
  @Property()
  createdAt: Date = new Date();
  
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

### Circular Dependencies

Use arrow functions in decorators to avoid circular dependency issues:

```typescript
@ManyToOne(() => Parent)  // Arrow function!
parent!: Parent;
```

## Resources

- [MikroORM Documentation](https://mikro-orm.io/)
- [MikroORM NestJS Integration](https://mikro-orm.io/docs/usage-with-nestjs)
- [Entity Definition](https://mikro-orm.io/docs/defining-entities)
- [EntityManager API](https://mikro-orm.io/docs/entity-manager)
