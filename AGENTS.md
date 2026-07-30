# Wallection — AGENTS.md

Premium wallpaper PWA platform. pnpm monorepo with 3 packages.

## Packages

| Path | Name | Stack |
|------|------|-------|
| `apps/web` | `@wallection/web` | Next.js 15, MUI v7, TanStack Query, Zustand, Playwright |
| `packages/backend` | `@wallection/backend` | Fastify, Redis, Docker |
| `packages/types` | `@wallection/types` | Shared TypeScript types |

## Commands

```bash
pnpm dev          # Frontend only (localhost:3000)
pnpm dev:backend  # Backend only (localhost:3001)
pnpm dev:all      # Both in parallel
pnpm build        # Build frontend
pnpm lint         # Lint all packages
pnpm typecheck    # Typecheck all packages
```

Filter to a single package:

```bash
pnpm --filter @wallection/web <cmd>
pnpm --filter @wallection/backend <cmd>
pnpm --filter @wallection/types <cmd>
```

## Per-package scripts

**web** — `dev`, `build`, `start`, `lint`, `typecheck`, `test:e2e` (Playwright), `test:e2e:ui`, `test:e2e:headed`
**backend** — `dev` (tsx watch), `build` (tsc), `start`, `lint`, `typecheck`
**types** — `typecheck`

## Testing

- E2E tests only (Playwright, Chromium, Pixel 7 viewport): `pnpm test:e2e` inside `apps/web`
- No unit tests configured yet
- E2E runs against both local backend + frontend via `webServer`

## Code style

- TypeScript strict mode (base tsconfig: ES2022, ESNext modules, bundler resolution)
- Barrel exports from `src/index.ts` in each package
- Fastify backend uses `zod` for validation
- Frontend uses MUI v7 + Emotion styled components + Framer Motion
- No semicolons in commit messages

## Security

- `.env` files with secrets are committed — do NOT commit new ones without review
- Backend uses `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/cors`
- Redis is expected for caching; no persistent DB
- CORS restricted via `CORS_ORIGIN` env var

## Deployment

- Frontend: Vercel (`apps/web`)
- Backend: Docker (see `packages/backend/Dockerfile`) — runs on port 3001
- Uses pnpm 10.28.0 in Docker; `corepack` enabled

## Commit messages

Format: `[package] Short description` (e.g., `[web] Add dark mode toggle`, `[backend] Rate-limit search endpoint`)

## Environment

- Node >= 20, pnpm >= 9
- Redis instance required for backend
- Reddit API or Wallhaven/Wallpapers.com API keys for wallpaper sources
