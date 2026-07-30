# @wallection/backend — AGENTS.md

Fastify API server serving wallpaper data. Redis cache, Reddit/Wallhaven/Wallpapers.com sources.

## Commands

```bash
pnpm dev       # tsx watch src/index.ts (hot reload)
pnpm build     # tsc -> dist/
pnpm start     # node --import tsx/esm dist/index.js
pnpm lint      # eslint src/
pnpm typecheck # tsc --noEmit
```

## Directories

| Path | Purpose |
|------|---------|
| `src/config/` | Env vars, category definitions |
| `src/routes/` | Fastify route handlers |
| `src/controllers/` | Request logic per endpoint |
| `src/services/` | Reddit/Wallhaven/Wallpapers.com API clients, cache layer |
| `src/middleware/` | Fastify hooks/plugins |
| `src/types/` | Zod schemas + TS types |
| `src/utils/` | Helpers |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/categories` | List categories |
| GET | `/categories/:slug` | Category by slug |
| GET | `/wallpapers` | Paginated wallpapers |
| GET | `/wallpaper/:id` | Single wallpaper |
| GET | `/search?q=` | Search wallpapers |
| GET | `/search/trending` | Trending searches |

## Security

- Uses `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/cors`, `@fastify/compress`
- Rate limiting is active on all endpoints
- CORS origin configurable via `CORS_ORIGIN` env var
- No authentication — public read-only API
- **DO NOT** commit `.env` files — the existing `.env` has production keys

## Conventions

- `type: "module"` in package.json — ESM imports
- `zod` for request validation schemas
- Redis as single cache layer (ioredis)
- Docker build: multi-stage, `node:22-alpine`, runs as non-root `fastify` user

## Deployment

- Docker: `docker build -t wallection-backend .` then `docker run -p 3001:3001`
- Requires `REDIS_URL` env var in production
- Exposes port 3001
