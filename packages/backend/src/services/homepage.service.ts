import type { Wallpaper } from "../types/index.js";
import {
  HOMEPAGE_COLLECTIONS,
  HERO_REQUIREMENTS,
  HOMEPAGE_BLOCKED_KEYWORDS,
  HERO_LIMIT,
  HOMEPAGE_CACHE_TTL,
} from "../config/homepageCollections.js";
import {
  SCORE_BONUSES,
  SCORE_PENALTIES,
  HERO_MINIMUM_SCORE,
} from "../config/homepageWeights.js";
import {
  searchWallhaven,
  transformWallhavenImage,
} from "./wallhaven.service.js";
import { cacheGet, cacheSet } from "./cache.service.js";
import { validateWallpapers } from "./validation.service.js";
import { logInfo, logError } from "../utils/logger.js";

const HOMEPAGE_CACHE_KEY = "homepage:curated";

export interface HomepageResult {
  hero: Wallpaper[];
  sections: {
    id: string;
    name: string;
    wallpapers: Wallpaper[];
  }[];
  generatedAt: string;
}

function scoreWallpaper(wallpaper: Wallpaper): number {
  let score = 0;

  for (const rule of SCORE_BONUSES) {
    if (rule.type === "tag") {
      if (
        wallpaper.tags.some((t) =>
          t.toLowerCase().includes(rule.match as string)
        )
      ) {
        score += rule.score;
      }
    } else if (rule.type === "resolution") {
      const res = `${wallpaper.width}x${wallpaper.height}`;
      if (res === rule.match) {
        score += rule.score;
      }
    } else if (rule.type === "favorites") {
      if (wallpaper.upvotes >= (rule.match as number)) {
        score += rule.score;
      }
    } else if (rule.type === "views") {
      if (wallpaper.views >= (rule.match as number)) {
        score += rule.score;
      }
    } else if (rule.type === "color") {
      if (wallpaper.colors.some((c) => c.replace("#", "") === rule.match)) {
        score += rule.score;
      }
    }
  }

  for (const rule of SCORE_PENALTIES) {
    if (rule.type === "tag") {
      if (
        wallpaper.tags.some((t) =>
          t.toLowerCase().includes(rule.match as string)
        )
      ) {
        score += rule.score;
      }
    }
  }

  return score;
}

function isHeroQuality(wallpaper: Wallpaper): boolean {
  if (wallpaper.width < HERO_REQUIREMENTS.minWidth) return false;
  if (wallpaper.height < HERO_REQUIREMENTS.minHeight) return false;

  if (wallpaper.orientation !== "landscape") return false;

  if (wallpaper.upvotes < HERO_REQUIREMENTS.minFavorites) return false;
  if (wallpaper.views < HERO_REQUIREMENTS.minViews) return false;

  const hasExcluded = wallpaper.tags.some((tag) =>
    HERO_REQUIREMENTS.excludeKeywords.some((excluded) =>
      tag.toLowerCase().includes(excluded)
    )
  );
  if (hasExcluded) return false;

  return true;
}

function isAllowed(wallpaper: Wallpaper): boolean {
  const hasBlocked = wallpaper.tags.some((tag) =>
    HOMEPAGE_BLOCKED_KEYWORDS.some((blocked) =>
      tag.toLowerCase().includes(blocked)
    )
  );
  return !hasBlocked;
}

async function fetchCollectionWallpapers(
  collection: (typeof HOMEPAGE_COLLECTIONS)[0],
  page: number = 1
): Promise<Wallpaper[]> {
  try {
    const result = await searchWallhaven({
      query: collection.query,
      categories: collection.categories,
      sorting: collection.sorting,
      topRange: collection.topRange,
      page,
      ratios: collection.aspectRatio,
    });

    const transformed = result.data.map(transformWallhavenImage);
    const validated = validateWallpapers(transformed);
    return validated.filter(isAllowed);
  } catch (error) {
    logError(
      `Failed to fetch collection "${collection.name}"`,
      error as Error
    );
    return [];
  }
}

export async function generateHomepage(): Promise<HomepageResult> {
  const cached = await cacheGet<HomepageResult>(HOMEPAGE_CACHE_KEY);
  if (cached) {
    logInfo("Serving cached homepage");
    return cached;
  }

  logInfo("Generating new homepage...");

  const allWallpapers: Wallpaper[] = [];
  const sections: HomepageResult["sections"] = [];

  for (const collection of HOMEPAGE_COLLECTIONS) {
    const page1 = await fetchCollectionWallpapers(collection, 1);
    const page2 = await fetchCollectionWallpapers(collection, 2);
    const collectionWallpapers = [...page1, ...page2];

    const scored = collectionWallpapers
      .map((w) => ({ wallpaper: w, score: scoreWallpaper(w) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((item) => item.wallpaper);

    sections.push({
      id: collection.id,
      name: collection.name,
      wallpapers: scored,
    });

    allWallpapers.push(...scored);

    logInfo(`Collection "${collection.name}": ${scored.length} wallpapers`);
  }

  const seen = new Set<string>();
  const uniqueWallpapers = allWallpapers.filter((w) => {
    if (seen.has(w.id)) return false;
    seen.add(w.id);
    return true;
  });

  const scoredWallpapers = uniqueWallpapers
    .map((w) => ({ wallpaper: w, score: scoreWallpaper(w) }))
    .filter((item) => item.score >= HERO_MINIMUM_SCORE)
    .sort((a, b) => b.score - a.score);

  const hero = scoredWallpapers
    .filter((item) => isHeroQuality(item.wallpaper))
    .slice(0, HERO_LIMIT)
    .map((item) => item.wallpaper);

  const result: HomepageResult = {
    hero,
    sections,
    generatedAt: new Date().toISOString(),
  };

  await cacheSet(HOMEPAGE_CACHE_KEY, result, HOMEPAGE_CACHE_TTL);

  logInfo(`Homepage generated: ${hero.length} hero, ${sections.length} sections`);

  return result;
}

export async function getHomepage(): Promise<HomepageResult> {
  try {
    return await generateHomepage();
  } catch (error) {
    logError("Homepage generation failed, trying cache", error as Error);

    const stale = await cacheGet<HomepageResult>(HOMEPAGE_CACHE_KEY);
    if (stale) {
      logInfo("Serving stale homepage cache");
      return stale;
    }

    throw error;
  }
}

export async function warmupHomepageCache(): Promise<void> {
  try {
    await generateHomepage();
    logInfo("Homepage cache warmed up");
  } catch (error) {
    logError("Homepage cache warmup failed", error as Error);
  }
}
