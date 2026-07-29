import type { Wallpaper } from "../types/index.js";
import type { Provider } from "../config/providers.js";
import { isValidProvider } from "../config/providers.js";
import {
  searchWallhaven,
  getWallhavenWallpaper,
  transformWallhavenImage,
} from "./wallhaven.service.js";
import {
  fetchWpcomListing,
  fetchWpcomWallpaper,
  searchWpcomWallpapers,
} from "./wallpaperscom.service.js";
import { cacheGet, cacheSet } from "./cache.service.js";
import { validateWallpapers, validateWallpaper } from "./validation.service.js";
import { CACHE_TTL } from "../config/cache.js";
import { logInfo, logError } from "../utils/logger.js";

function mapSortParam(sort: string): { sorting: string; topRange?: string } {
  if (sort === "hot") return { sorting: "toplist", topRange: "1w" };
  if (sort === "new") return { sorting: "date", topRange: undefined };
  return { sorting: "relevance", topRange: undefined };
}

function detectProvider(id: string, explicit?: string): string {
  if (explicit === "wallpaperscom" || id.startsWith("wpcom-")) return "wallpaperscom";
  return "wallhaven";
}

export async function getWallpapersByCategory(
  category: string,
  sort: string,
  page: number,
  wallhavenTags: string[],
  wallhavenCategories: string,
  ratios?: string,
  atleast?: string,
  provider?: string
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }> {
  if (detectProvider("", provider) === "wallpaperscom") {
    const result = await fetchWpcomListing(page);
    return {
      wallpapers: result.wallpapers,
      page: result.page,
      totalResults: result.totalResults,
      lastPage: result.wallpapers.length === 0 ? page : 9999,
    };
  }

  const cacheKey = `wallpapers:${category}:${sort}:${page}:${ratios || "all"}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }>(cacheKey);
  if (cached) return cached;

  const { sorting, topRange } = mapSortParam(sort);
  const query = wallhavenTags.length > 0 ? wallhavenTags.join(" ") : "";

  try {
    const result = await searchWallhaven({
      query,
      categories: wallhavenCategories,
      sorting,
      page,
      topRange: sorting === "toplist" ? topRange : undefined,
      ratios,
      atleast,
    });

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

export async function getWallpaperById(id: string, provider?: string): Promise<Wallpaper> {
  if (detectProvider(id, provider) === "wallpaperscom") {
    const slug = id.replace(/^wpcom-/, "");
    const wallpaper = await fetchWpcomWallpaper(slug);
    if (!wallpaper) throw new Error("Wallpaper not found on Wallpapers.com");
    return wallpaper;
  }

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
  limit: number = 24,
  ratios?: string,
  atleast?: string,
  provider?: string
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }> {
  const resolvedProvider = detectProvider(id, provider);

  if (resolvedProvider === "wallpaperscom") {
    const wallpaper = await getWallpaperById(id, "wallpaperscom");
    const searchTerms = [wallpaper.title, ...wallpaper.tags.slice(0, 5)].filter(Boolean).join(" ");
    const result = await searchWpcomWallpapers(searchTerms, page);
    const empty = result.wallpapers.length === 0;
    return {
      wallpapers: result.wallpapers.filter(w => w.id !== id),
      page: result.page,
      totalResults: result.totalResults,
      lastPage: empty ? page : 9999,
    };
  }

  const cacheKey = `similar:${id}:${page}:${limit}:${ratios || "all"}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number; lastPage: number }>(cacheKey);
  if (cached) return cached;

  try {
    const wallpaper = await getWallpaperById(id);
    const allTags = wallpaper.tags.join(" ");
    const categories = wallpaper.subreddit === "Anime" ? "010" : "110";

    const tagResult = await searchWallhaven({ query: allTags, categories, sorting: "relevance", page, ratios, atleast });
    let candidates = tagResult.data
      .map(transformWallhavenImage)
      .filter((w) => w.id !== id);
    let wallpapers = validateWallpapers(candidates);

    if (wallpapers.length < limit) {
      const categoryQuery = wallpaper.subreddit.toLowerCase();
      const categoryResult = await searchWallhaven({ query: categoryQuery, categories, sorting: "relevance", page, ratios, atleast });
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
  page: number,
  ratios?: string,
  atleast?: string,
  provider?: string
): Promise<{ wallpapers: Wallpaper[]; query: string; totalResults: number }> {
  if (provider === "wallpaperscom") {
    const result = await searchWpcomWallpapers(query, page);
    return {
      wallpapers: result.wallpapers,
      query,
      totalResults: result.totalResults,
    };
  }

  const cacheKey = `search:${query.toLowerCase()}:${sort}:${page}:${ratios || "all"}`;

  const cached = await cacheGet<{ wallpapers: Wallpaper[]; query: string; totalResults: number }>(cacheKey);
  if (cached) return cached;

  const { sorting, topRange } = mapSortParam(sort);

  try {
    const result = await searchWallhaven({
      query,
      categories: "111",
      sorting,
      page,
      topRange: sorting === "toplist" ? topRange : undefined,
      ratios,
      atleast,
    });

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
