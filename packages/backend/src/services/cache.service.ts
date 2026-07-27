import { getRedis } from "../config/redis.js";
import { CACHE_TTL } from "../config/cache.js";
import { logInfo } from "../utils/logger.js";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();

  if (redis) {
    try {
      const raw = await redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      // Fall through to memory
    }
  }

  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

export async function cacheSet<T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
  const redis = getRedis();

  if (redis) {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttl);
      return;
    } catch {
      // Fall through to memory
    }
  }

  const expiresAt = Date.now() + ttl * 1000;
  memoryCache.set(key, { value, expiresAt });
}

export async function cacheDelete(key: string): Promise<void> {
  const redis = getRedis();

  if (redis) {
    try {
      await redis.del(key);
    } catch {
      // Fall through to memory
    }
  }

  memoryCache.delete(key);
}

export async function cacheClear(): Promise<void> {
  const redis = getRedis();

  if (redis) {
    try {
      await redis.flushdb();
    } catch {
      // Fall through to memory
    }
  }

  memoryCache.clear();
}

export async function cacheSize(): Promise<number> {
  const redis = getRedis();

  if (redis) {
    try {
      const keys = await redis.dbsize();
      return keys;
    } catch {
      // Fall through to memory
    }
  }

  return memoryCache.size;
}

// Memory cache cleanup (only matters when Redis is unavailable)
const CLEANUP_INTERVAL = 60_000;
setInterval(() => {
  const redis = getRedis();
  if (redis) return; // Redis handles TTL natively

  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
    }
  }
}, CLEANUP_INTERVAL);
