import Redis from "ioredis";
import { getEnv } from "./env.js";
import { logInfo, logError } from "../utils/logger.js";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  return redis;
}

export function createRedisClient(): Redis | null {
  const env = getEnv();

  if (!env.REDIS_URL) {
    logInfo("No REDIS_URL provided, using memory cache only");
    return null;
  }

  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true,
      enableReadyCheck: true,
    });

    redis.on("error", (err) => {
      logError("Redis connection error", err as Error);
    });

    redis.on("connect", () => {
      logInfo("Redis connected");
    });

    return redis;
  } catch (err) {
    logError("Failed to create Redis client", err as Error);
    return null;
  }
}

export async function connectRedis(): Promise<boolean> {
  const env = getEnv();

  if (!env.REDIS_URL || !redis) {
    return false;
  }

  try {
    await redis.connect();
    await redis.ping();
    logInfo("Redis connection verified");
    return true;
  } catch (err) {
    logError("Redis connection failed", err as Error);
    logInfo("Falling back to memory cache");
    redis = null;
    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
