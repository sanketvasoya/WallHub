import { CACHE_TTL } from "../config/blockedKeywords";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

export function cacheSet<T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): void {
  const expiresAt = Date.now() + ttl * 1000;
  memoryCache.set(key, { value, expiresAt });
}

export function cacheDelete(key: string): void {
  memoryCache.delete(key);
}

export function cacheClear(): void {
  memoryCache.clear();
}

export function cacheSize(): number {
  return memoryCache.size;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
    }
  }
}, 60000);
