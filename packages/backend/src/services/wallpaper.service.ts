import type { Wallpaper } from "../types/index.js";
import {
  searchWallhaven,
  getWallhavenWallpaper,
  transformWallhavenImage,
} from "./wallhaven.service.js";
import { cacheGet, cacheSet } from "./cache.service.js";
import { validateWallpapers, validateWallpaper } from "./validation.service.js";
import { CACHE_TTL } from "../config/cache.js";
import { logInfo, logError } from "../utils/logger.js";

function mapSortParam(sort: string): { sorting: string; topRange?: string } {
  if (sort === "hot") return { sorting: "toplist", topRange: "1w" };
  if (sort === "new") return { sorting: "date", topRange: undefined };
  return { sorting: "relevance", topRange: undefined };
}

export async function getWallpapersByCategory(
  category: string,
  sort: string,
  page: number,
  wallhavenTags: string[],
  wallhavenCategories: string
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }> {
  const cacheKey = `wallpapers:${category}:${sort}:${page}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }>(cacheKey);
  if (cached) return cached;

  const { sorting, topRange } = mapSortParam(sort);
  const query = wallhavenTags.length > 0 ? wallhavenTags.join(" ") : "";

  try {
    const result = await searchWallhaven(
      query,
      wallhavenCategories,
      sorting,
      page,
      sorting === "toplist" ? topRange : undefined
    );

    const transformed = result.data.map(transformWallhavenImage);
    const wallpapers = validateWallpapers(transformed);

    logInfo(`Fetched ${wallpapers.length} wallpapers for category: ${category}`, {
      totalFromApi: result.data.length,
      afterValidation: wallpapers.length,
    });

    const response = {
      wallpapers,
      page,
      totalResults: result.meta.total,
      lastPage: result.meta.last_page,
    };

    await cacheSet(cacheKey, response, CACHE_TTL.SHORT);
    return response;
  } catch (error) {
    logError(`Failed to fetch wallpapers for category: ${category}`, error as Error);
    throw error;
  }
}

export async function getWallpaperById(id: string): Promise<Wallpaper> {
  const cacheKey = `wallpaper:${id}`;

  const cached = await cacheGet<Wallpaper>(cacheKey);
  if (cached) return cached;

  try {
    const image = await getWallhavenWallpaper(id);
    const wallpaper = transformWallhavenImage(image);

    const validation = validateWallpaper(wallpaper);
    if (!validation.isValid) {
      logInfo(`Wallpaper ${id} failed validation: ${validation.reason}`);
      throw new Error(`Wallpaper failed content validation: ${validation.reason}`);
    }

    await cacheSet(cacheKey, wallpaper, CACHE_TTL.LONG);
    return wallpaper;
  } catch (error) {
    logError(`Failed to fetch wallpaper by id: ${id}`, error as Error);
    throw error;
  }
}

export async function getSimilarWallpapers(
  id: string,
  page: number = 1,
  limit: number = 24
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }> {
  const cacheKey = `similar:${id}:${page}:${limit}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }>(cacheKey);
  if (cached) return cached;

  try {
    const wallpaper = await getWallpaperById(id);
    const allTags = wallpaper.tags.join(" ");
    const categories = wallpaper.subreddit === "Anime" ? "010" : "110";

    const tagResult = await searchWallhaven(allTags, categories, "relevance", page);
    let candidates = tagResult.data
      .map(transformWallhavenImage)
      .filter((w) => w.id !== id);
    let wallpapers = validateWallpapers(candidates);

    if (wallpapers.length < limit) {
      const categoryQuery = wallpaper.subreddit.toLowerCase();
      const categoryResult = await searchWallhaven(categoryQuery, categories, "relevance", page);
      const seen = new Set(candidates.map((w) => w.id));
      const extra = categoryResult.data
        .map(transformWallhavenImage)
        .filter((w) => w.id !== id && !seen.has(w.id));
      wallpapers = wallpapers.concat(validateWallpapers(extra));
    }

    const response = {
      wallpapers: wallpapers.slice(0, limit),
      page,
      totalResults: tagResult.meta.total,
      lastPage: tagResult.meta.last_page,
    };

    await cacheSet(cacheKey, response, CACHE_TTL.SHORT);
    return response;
  } catch (error) {
    logError(`Failed to fetch similar wallpapers for: ${id}`, error as Error);
    throw error;
  }
}

export async function searchWallpapers(
  query: string,
  sort: string,
  page: number
): Promise<{ wallpapers: Wallpaper[]; query: string; totalResults: number }> {
  const cacheKey = `search:${query.toLowerCase()}:${sort}:${page}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; query: string; totalResults: number }>(cacheKey);
  if (cached) return cached;

  const { sorting, topRange } = mapSortParam(sort);

  try {
    const result = await searchWallhaven(
      query,
      "111",
      sorting,
      page,
      sorting === "toplist" ? topRange : undefined
    );

    const transformed = result.data.map(transformWallhavenImage);
    const wallpapers = validateWallpapers(transformed);

    logInfo(`Search "${query}" returned ${wallpapers.length} wallpapers`, {
      totalFromApi: result.data.length,
      afterValidation: wallpapers.length,
    });

    const response = {
      wallpapers,
      query,
      totalResults: result.meta.total,
    };

    await cacheSet(cacheKey, response, CACHE_TTL.MEDIUM);
    return response;
  } catch (error) {
    logError(`Failed to search wallpapers: ${query}`, error as Error);
    throw error;
  }
}
