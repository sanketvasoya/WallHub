# @wallection/types — AGENTS.md

Shared TypeScript types used by both `@wallection/web` and `@wallection/backend`.

## Commands

```bash
pnpm typecheck  # tsc --noEmit
```

## Conventions

- `type: "module"` — ESM
- Single entry point: `src/index.ts` (barrel export)
- Types are imported by other packages via workspace protocol (`@wallection/types: "workspace:*"`)
- No runtime code — types only
- Keep types lean; avoid importing from framework packages
- Add JSDoc for any type that crosses the frontend/backend boundary (API response shapes, etc.)
