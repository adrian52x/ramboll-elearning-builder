API endpoints & contracts
Use REST endpoints (or GraphQL if preferred). Example REST routes:

Modules

GET /modules — list modules (with pagination)
POST /modules — create module (with steps & blocks optional)
GET /modules/:id — full module with steps and blocks (for rendering)
PATCH /modules/:id — update module metadata
DELETE /modules/:id
Steps (nested under module)

POST /modules/:moduleId/steps — create step (with blocks)
PATCH /modules/:moduleId/steps/:stepId — patch/rerorder
DELETE /modules/:moduleId/steps/:stepId
POST /modules/:moduleId/steps/:stepId/blocks/reorder — atomic reorder
Blocks (per step)

POST /modules/:moduleId/steps/:stepId/blocks — create block (supply type and typed payload or dataId)
GET /modules/:moduleId/steps/:stepId/blocks/:blockId
PATCH /modules/:moduleId/steps/:stepId/blocks/:blockId
DELETE /modules/:moduleId/steps/:stepId/blocks/:blockId


Postgres: localhost:5432 (user: dev, password: dev, db: ramboll-elearning)
PgAdmin (optional): http://localhost:5050 (login: admin@example.com / admin)

src/
  main.ts
  app.module.ts
  modules/
    modules/   # module = course/course module
      controllers/
        modules.controller.ts
      services/
        modules.service.ts
      repositories/
        modules.repository.ts
      entities/
        module.entity.ts
        step.entity.ts
      dto/
        create-module.dto.ts
      modules.module.ts
    blocks/
      controllers/
        blocks.controller.ts
      services/
        blocks.service.ts
      repositories/
        block.repository.ts
        block-video.repository.ts
      entities/
        block.entity.ts
        block-video.entity.ts
        block-image.entity.ts
      dto/
        create-video.dto.ts
      blocks.module.ts
  common/
    pipes/
    filters/
    guards/
    interceptors/
    validators/
  database/
    typeorm.config.ts
    migrations/
  config/
  utils/



cd D:\Coding\Js_projects\bachelor-project\server

# Generate Universe module
npx nest g module modules/universes
npx nest g controller modules/universes --no-spec
npx nest g service modules/universes --no-spec
npx nest g class entities/universe.entity --no-spec

# Generate Unit module
npx nest g module modules/units
npx nest g controller modules/units --no-spec
npx nest g service modules/units --no-spec
npx nest g class entities/unit.entity --no-spec

# Generate User module
npx nest g module modules/users
npx nest g controller modules/users --no-spec
npx nest g service modules/users --no-spec
npx nest g class entities/user.entity --no-spec

# Generate Courses module
npx nest g module modules/e-learnings
npx nest g controller modules/e-learnings --no-spec
npx nest g service modules/e-learnings --no-spec
npx nest g class modules/e-learnings/entities/e-learning.entity --no-spec

# Generate DTOs for each (optional but recommended)
npx nest g class modules/universes/dto/create-universe.dto --no-spec
npx nest g class modules/units/dto/create-unit.dto --no-spec
npx nest g class modules/users/dto/create-user.dto --no-spec
npx nest g class modules/courses/dto/create-course.dto --no-spec






The Real Setup (They DON'T switch databases)
Your Confusion:
❌ You're thinking: "They'll replace PostgreSQL with MySQL for everything"

Reality:
✅ They'll use BOTH databases simultaneously:

Their MySQL (existing) - Read Universe/Unit/User
Your PostgreSQL (new) - Write Course/Module/Block data

┌─────────────────────────────────────────────────┐
│         Your NestJS Application                 │
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐ │
│  │   PostgreSQL     │    │   Their MySQL    │ │
│  │   (NEW)          │    │   (EXISTING)     │ │
│  │                  │    │                  │ │
│  │ ✨ Your Tables:  │    │ 📖 Read-Only:   │ │
│  │ - courses        │    │ - universes     │ │
│  │ - modules        │    │ - units         │ │
│  │ - lessons        │    │ - users         │ │
│  │ - blocks         │    │                 │ │
│  │ - progress       │    │ (100+ other     │ │
│  │ - assignments    │    │  tables they    │ │
│  │                  │    │  don't touch)   │ │
│  └──────────────────┘    └──────────────────┘ │
│         ↕️ READ/WRITE           ↕️ READ ONLY    │
└─────────────────────────────────────────────────┘