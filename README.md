# Wallection

Premium wallpaper PWA platform built with Next.js 15, MUI v7, and Fastify.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, MUI v7, TanStack Query, Zustand, Framer Motion
- **Backend**: Fastify, TypeScript, Reddit API, Redis Cache, Rate Limiting
- **PWA**: Service Workers, Web App Manifest, Offline Support

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Redis instance

### 1. Clone & Install

```bash
pnpm install
```

### 2. Environment Variables

Copy the root `.env.example` to `.env` and fill in Reddit API credentials:

```bash
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=Wallection/1.0
REDIS_URL=redis://localhost:6379
```

Get Reddit API credentials at https://www.reddit.com/prefs/apps

### 3. Start Redis

```bash
redis-server
```

### 4. Development

```bash
# Start both frontend and backend
pnpm dev:all

# Or separately
pnpm dev          # Frontend at http://localhost:3000
pnpm dev:backend  # Backend at http://localhost:3001
```

### 5. Production Build

```bash
pnpm build
```

## Project Structure

```
Wallection/
  apps/
    web/                  # Next.js frontend
      src/
        app/              # App Router pages
        components/       # UI components
        hooks/            # React Query hooks
        lib/              # API client, stores, theme
        providers/        # Theme & Query providers
        types/            # TypeScript types
      public/             # Static assets, PWA manifest
  packages/
    backend/              # Fastify API server
      src/
        config/           # Env, categories
        routes/           # API routes
        services/         # Reddit API, cache
        types/            # Shared types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/categories` | List all categories |
| GET | `/categories/:slug` | Get category by slug |
| GET | `/wallpapers` | Get wallpapers with pagination |
| GET | `/wallpaper/:id` | Get single wallpaper |
| GET | `/search?q=` | Search wallpapers |
| GET | `/search/trending` | Get trending searches |

## Categories

30+ categories including: Trending, Nature, Space, Cities, Minimal, Anime, Cyberpunk, AMOLED, Gaming, Desktop, Mobile, and more.

Each category maps to one or more Reddit communities.

## Features

- Responsive design (mobile, tablet, desktop)
- Dark/Light/System theme
- Infinite scroll
- Full-screen wallpaper viewer
- Favorites (local storage)
- Search with history and suggestions
- PWA installable
- Rate-limited API
- Redis caching
- Image proxy via Reddit URLs
- SEO optimized

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel deploy
```

### Backend (Railway / Fly.io / Docker)

```bash
cd packages/backend
docker build -t wallection-backend .
docker run -p 3001:3001 wallection-backend
```

### Environment Variables for Production

```
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDIS_URL=redis://your-redis-host:6379
CORS_ORIGIN=https://your-domain.com
NODE_ENV=production
```

## License

MIT
