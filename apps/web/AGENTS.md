# @wallection/web — AGENTS.md

Next.js 15 App Router frontend. MUI v7, TanStack Query, Zustand, Framer Motion.

## Commands

```bash
pnpm dev            # Next.js dev server (localhost:3000)
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # next lint
pnpm typecheck      # tsc --noEmit
pnpm test:e2e       # Playwright headless
pnpm test:e2e:ui    # Playwright UI mode
pnpm test:e2e:headed # Playwright headed
```

## Directories

| Path | Purpose |
|------|---------|
| `src/app/` | App Router pages (route groups, layout) |
| `src/components/` | Reusable UI components |
| `src/hooks/` | React Query hooks + custom hooks |
| `src/lib/` | API client (`axios`), stores (`zustand`), theme (`MUI`) |
| `src/providers/` | Theme + Query client providers |
| `src/types/` | Local TypeScript types |
| `e2e/` | Playwright tests |
| `public/` | Static assets, PWA manifest, icons |

## Conventions

- Use `@/` path alias for `src/` imports
- Components: MUI v7 + Emotion `styled` + Framer Motion for animations
- State: React Query for server state, Zustand for client state
- Forms: `react-hook-form` + `zod` for validation
- PWA: service worker + Web App Manifest in `public/`
- Offline: `idb-keyval` for IndexedDB favorites

## Testing

- Playwright tests in `e2e/`
- Tests boot both backend and frontend via `webServer` config
- Mobile-first: runs in Pixel 7 viewport by default
- No unit tests — E2E only

## Security

- `@wallection/types` is a workspace dependency for shared types
- API base URL from `NEXT_PUBLIC_API_URL` env var
