import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import compress from "@fastify/compress";
import { getEnv } from "./config/env";
import { categoryRoutes } from "./routes/categories";
import { wallpaperRoutes } from "./routes/wallpaper.routes";
import { initLogger } from "./utils/logger";

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
  methods: ["GET"],
  credentials: false,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

await app.register(compress);

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

async function shutdown() {
  app.log.info("Shutting down...");
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
