# WallHub Architecture Optimization & Feature Plan

## Decision: Redis

Redis is **required** in production. Backend fails fast on startup if `REDIS_URL` is unreachable. Memory cache is used as fallback **only** when `NODE_ENV !== 'production'` or when `REDIS_URL` is missing. This keeps small local dev simple while ensuring production has shared cache across instances.

## Implementation Order

### 1. Shared Types Package
- Create `packages/types` with `Wallpaper`, `Category`, `WallpapersResponse`, `SearchResponse`, `CategoriesResponse`.
- Backend imports `@wallhub/types`; frontend imports same package.
- Keep frontend-only types (`ThemeMode`, `SortOption`) in `apps/web/src/types`.

### 2. Redis Cache Activation
- Replace in-memory `Map` in `cache.service.ts` with `ioredis` client.
- Fallback to memory cache only when `NODE_ENV !== 'production'` or no `REDIS_URL`.
- Add startup health check; crash process in production if Redis unreachable.
- Prevent cache stampede: keep TTLs short enough that cold start is bounded.

### 3. Standardized API Errors + Validation
- Global Fastify error handler: `{ error: string, code?: string, details?: unknown }`.
- Add Zod schemas for query/params in controllers.

### 4. Service Worker
- Use `next-pwa` with `generateSW`.
- Runtime caching: static assets cacheFirst, API metadata staleWhileRevalidate, images cacheFirst 7d.
- Add offline indicator using `navigator.onLine`.
- Vercel: test with `output: 'standalone'` or Cloudflare Pages; if incompat, defer to static export.

### 5. Image Optimization
- Configure `images.remotePatterns` for `wallhaven.cc`.
- Use `<Image>` with custom loader for external URLs OR `unoptimized` for those URLs.
- Add `priority` only to hero/featured images.

### 6. Download History
- Extend Zustand with `downloadHistory` using `idb-keyval` persistence.
- Cap at 50 entries, evict oldest.
- Add `/downloads` page with clear-all.

### 7. Collections
- Backend: `config/collections.ts` with static `COLLECTIONS` array.
- Endpoints: `GET /collections`, `GET /collections/:slug`.
- Frontend: `/collections` grid, `/collections/[slug]` page.

### 8. Enhanced Homepage
- Add "New Arrivals" (`sort=new`) and "Editor's Picks" (`topRange=1d`, cache results in config).
- Per-section `LoadingSkeleton`.

### 9. Category Search UI
- Debounced search in Header drawer routing to `/category/:slug`.

### 10. Sort Persistence
- Zustand: `{ [categorySlug]: sortOption }` persisted to localStorage.

### 11. Dynamic Metadata
- `generateMetadata` on category, wallpaper, search pages.

### 12. Keyboard Shortcuts
- Add left/right arrow navigation in viewer when info panel closed.
- Add "?" toggle for shortcuts overlay.

### 13. Rate Limit UX
- Pass through Wallhaven 429 with preserved headers.
- Frontend shows retry countdown toast.

### 14. Analytics
- Backend: `POST /api/analytics/page-view` stores in Redis sorted sets.
- Daily aggregates only, no PII.

### 15. Backend Production Hardening
- Add `@fastify/redis` plugin.
- Fix Dockerfile: compiled JS only, no `tsx`.
- Add `request-id` middleware.

## Non-Goals
- User accounts, cloud sync, social features, admin CMS, i18n.

## Validation
- `pnpm typecheck` + `pnpm build` after each package change.
- E2E smoke: `/`, `/category/trending`, `/search?q=nature`, `/wallpaper/:id`, `/favorites`.
- Lighthouse: PWA, performance.
