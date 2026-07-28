import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import compress from "@fastify/compress";
import { getEnv } from "./config/env.js";
import { createRedisClient, connectRedis, disconnectRedis } from "./config/redis.js";
import { categoryRoutes } from "./routes/categories.js";
import { wallpaperRoutes } from "./routes/wallpaper.routes.js";
import { analyticsRoutes } from "./routes/analytics.routes.js";
import { collectionRoutes } from "./routes/collection.routes.js";
import { homepageRoutes } from "./routes/homepage.routes.js";
import { initLogger } from "./utils/logger.js";
import { warmupHomepageCache } from "./services/homepage.service.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestId } from "./middleware/request-id.js";

const env = getEnv();

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  trustProxy: true,
});

initLogger(app.log);

await app.register(helmet, {
  contentSecurityPolicy: false,
});

await app.register(cors, {
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST"],
  credentials: false,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

await app.register(compress);

app.setErrorHandler(errorHandler);

app.addHook("onRequest", requestId);

app.get("/", async () => {
  return {
    name: "WallHub API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  };
});

app.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

await app.register(categoryRoutes);
await app.register(wallpaperRoutes);
await app.register(analyticsRoutes);
await app.register(collectionRoutes);
await app.register(homepageRoutes);

// Connect Redis on startup
createRedisClient();
await connectRedis();

// Warmup homepage cache
warmupHomepageCache().catch(() => {
  app.log.warn("Homepage cache warmup failed, will retry on first request");
});

async function shutdown() {
  app.log.info("Shutting down...");
  await disconnectRedis();
  await app.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

try {
  await app.listen({ port: env.BACKEND_PORT, host: env.BACKEND_HOST });
  app.log.info(`WallHub backend running on http://${env.BACKEND_HOST}:${env.BACKEND_PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
