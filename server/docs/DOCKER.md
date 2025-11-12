# Docker Setup

## Environment Variables

The `docker-compose.yml` reads credentials from `.env` file. Make sure to copy `.env.example` to `.env` and update values if needed.

## Services

### NestJS Backend
- **URL:** http://localhost:3000 (configurable via `PORT`)
- **Hot reload:** enabled via volume mount
- **Environment:** uses `DB_HOST=postgres` (internal Docker network)

### PostgreSQL
- **Host (from host machine):** localhost:5432
- **Host (from backend container):** postgres:5432
- **Username:** set via `DB_USERNAME` (default: dev)
- **Password:** set via `DB_PASSWORD` (default: dev)
- **Database:** set via `DB_NAME` (default: ramboll-elearning)

### PgAdmin (optional)
- **URL:** http://localhost:5050 (configurable via `PGADMIN_PORT`)
- **Email:** set via `PGADMIN_EMAIL` (default: admin@example.com)
- **Password:** set via `PGADMIN_PASSWORD` (default: admin)

## Commands

### Run everything with Docker (recommended):
```bash
# Build and start all services (backend + postgres + pgadmin)
docker-compose up --build

# Run in background (detached)
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild only backend
docker-compose up -d --build backend

# Restart backend after code changes (hot reload should handle it)
docker-compose restart backend
```

### Run backend locally (without Docker):
If you prefer to run backend via `npm run start:dev` locally and only use Docker for Postgres:

1. Comment out or remove the `backend` service from `docker-compose.yml`
2. Change `DB_HOST=localhost` in `.env` (instead of `postgres`)
3. Run:
```bash
docker-compose up -d postgres pgadmin
npm run start:dev
```

## Development Workflow

### With Docker (full stack):
1. Update code in your editor
2. Changes are auto-detected (hot reload via volume mount)
3. Backend restarts automatically

### Without Docker (backend local):
1. `docker-compose up -d postgres` (only DB)
2. `npm run start:dev` (local backend with hot reload)

## Networking Notes

- **Inside Docker network:**
  - Backend connects to Postgres via `postgres:5432` (service name)
  - Services communicate via internal Docker network
  
- **From host machine:**
  - Backend: `localhost:3000`
  - Postgres: `localhost:5432`
  - PgAdmin: `localhost:5050`

## Security Notes

- ⚠️ `.env` is gitignored (contains secrets)
- ✅ `.env.example` is committed (template with no real secrets)
- 🔐 Change default passwords in production!
- 🐳 Dockerfile is for **development only** (not production-optimized)

## Troubleshooting

**Backend can't connect to Postgres:**
- Make sure `DB_HOST=postgres` in backend container env
- Check postgres is running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`

**Port already in use:**
- Change ports in `.env` (e.g., `PORT=3001`, `DB_PORT=5433`)

**Hot reload not working:**
- Ensure volume mount is correct in docker-compose.yml
- Try: `docker-compose restart backend`


┌─────────────────────────────────────────────────────┐
│  Docker Internal Network (bridge)                   │
│                                                      │
│  ┌──────────────┐       ┌──────────────┐           │
│  │   backend    │──────▶│   postgres   │           │
│  │ (NestJS)     │       │ (PostgreSQL) │           │
│  │              │       │              │           │
│  │ connects to: │       │ hostname:    │           │
│  │ postgres:5432│       │ "postgres"   │           │
│  └──────────────┘       └──────────────┘           │
│                                                      │
└─────────────────────────────────────────────────────┘
         │                        │
         │ exposed ports          │
         ▼                        ▼
    localhost:3000          localhost:5432
  (your host machine)    (your host machine)


From different perspectives:
1. From your host machine (Windows):
Backend: localhost:3000 or 127.0.0.1:3000
Postgres: localhost:5432 or 127.0.0.1:5432
PgAdmin: localhost:5050 or 127.0.0.1:5050

2. From inside the backend container:
Postgres: postgres:5432 (service name)
PgAdmin: pgadmin:80 (service name)
Itself: localhost:3000 or backend:3000

3. From inside the Postgres container:
Backend: backend:3000 (service name)
Itself: localhost:5432 or postgres:5432