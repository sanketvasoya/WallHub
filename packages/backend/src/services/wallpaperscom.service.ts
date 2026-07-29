import type { Wallpaper } from "../types/index.js";
import { cacheGet, cacheSet } from "./cache.service.js";
import { CACHE_TTL } from "../config/cache.js";
import { logInfo, logError } from "../utils/logger.js";
import { PROVIDER_LABELS } from "../config/providers.js";

interface WpcomImageObject {
  "@id": string;
  name?: string;
  caption?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  url?: string;
}

interface WpcomListItem {
  position: number;
  item: WpcomImageObject;
}

interface WpcomCollectionPageLD {
  mainEntity?: {
    itemListElement?: WpcomListItem[];
  };
}

const LISTING_URL = "https://wallpapers.com/discover-wallpapers";
const SEARCH_URL = "https://wallpapers.com/discover-wallpapers";

function extractSlug(wallpaperUrl: string): string {
  const match = wallpaperUrl.match(/\/([^/]+)\.html$/);
  return match ? match[1]! : wallpaperUrl.split("/").pop()?.replace(".html", "") || "";
}

function extractIdFromUrl(wallpaperUrl: string): string {
  const slug = extractSlug(wallpaperUrl);
  return `wpcom-${slug}`;
}

function getProviderId(slug: string): string {
  return `wpcom-${slug}`;
}

function extractResolution(name: string, caption: string): { width: number; height: number } {
  const resMatch = caption.match(/(\d+)x(\d+)/);
  if (resMatch) {
    return { width: parseInt(resMatch[1]!), height: parseInt(resMatch[2]!) };
  }
  return { width: 1920, height: 1080 };
}

function getOrientation(w: number, h: number): "landscape" | "portrait" | "square" {
  if (w > h) return "landscape";
  if (h > w) return "portrait";
  return "square";
}

function calculateAspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  const rw = w / d;
  const rh = h / d;
  if (rw > 100 || rh > 100) {
    const ratio = (w / h).toFixed(1);
    return `${ratio}:1`;
  }
  return `${rw}:${rh}`;
}

function tagsFromCaption(caption: string): string[] {
  const words = caption.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()).filter(Boolean);
  const unique = [...new Set(words)];
  return unique.slice(0, 10);
}

function transformWpcomImage(item: WpcomImageObject): Wallpaper | null {
  const wallpaperUrl = item.url || item["@id"];
  if (!wallpaperUrl) return null;

  const slug = extractSlug(wallpaperUrl);
  const id = getProviderId(slug);
  const name = item.name || "Wallpaper";
  const caption = item.caption || "";
  const { width, height } = extractResolution(name, caption);
  const imageUrl = item.contentUrl || `https://wallpapers.com/images/hd/${slug}.jpg`;
  const thumbUrl = item.thumbnailUrl || `https://wallpapers.com/images/thumbnail/${slug}.jpg`;

  const tags = tagsFromCaption(caption);

  return {
    id,
    title: name,
    image: imageUrl,
    preview: imageUrl,
    thumbnail: thumbUrl,
    width,
    height,
    aspectRatio: calculateAspectRatio(width, height),
    filesize: "N/A",
    upvotes: 0,
    author: "wallpapers.com",
    subreddit: "General",
    createdAt: new Date().toISOString(),
    originalUrl: wallpaperUrl,
    orientation: getOrientation(width, height),
    nsfw: false,
    tags,
    colors: [],
    source: PROVIDER_LABELS.wallpaperscom,
    views: 0,
  };
}

function parseJsonLd(html: string): WpcomImageObject[] {
  const items: WpcomImageObject[] = [];

  const ldRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = ldRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim()) as WpcomCollectionPageLD | WpcomCollectionPageLD[];

      const graphs = Array.isArray(parsed) ? parsed : [parsed];

      for (const graph of graphs) {
        if (graph.mainEntity?.itemListElement) {
          for (const listItem of graph.mainEntity.itemListElement) {
            if (listItem.item) {
              items.push(listItem.item);
            }
          }
        }
      }
    } catch {
      // skip invalid JSON
    }
  }

  return items;
}

export async function fetchWpcomListing(
  page: number = 1,
  _query?: string
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number }> {
  const cacheKey = `wpcom:listing:${page}:${_query || "all"}`;
  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number }>(cacheKey);
  if (cached) return cached;

  try {
    const url = _query
      ? `https://wallpapers.com/search?q=${encodeURIComponent(_query)}&p=${page}`
      : `https://wallpapers.com/discover-wallpapers${page > 1 ? `?p=${page}` : ""}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Wallection/1.0" },
    });

    if (!response.ok) {
      const error = new Error(`Wallpapers.com error: ${response.status}`) as Error & { statusCode: number };
      error.statusCode = response.status;
      throw error;
    }

    const html = await response.text();
    const images = parseJsonLd(html);

    const wallpapers: Wallpaper[] = [];
    for (const item of images) {
      const wallpaper = transformWpcomImage(item);
      if (wallpaper) {
        wallpapers.push(wallpaper);
      }
    }

    logInfo(`Fetched ${wallpapers.length} wallpapers from Wallpapers.com`, {
      page,
      totalFromApi: images.length,
      afterValidation: wallpapers.length,
    });

    const result = { wallpapers, page, totalResults: wallpapers.length };

    await cacheSet(cacheKey, result, CACHE_TTL.SHORT);
    return result;
  } catch (error) {
    logError("Failed to fetch Wallpapers.com listing", error as Error);
    throw error;
  }
}

export async function fetchWpcomWallpaper(slug: string): Promise<Wallpaper | null> {
  const cacheKey = `wpcom:wallpaper:${slug}`;
  const cached = await cacheGet<Wallpaper>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://wallpapers.com/wallpapers/${slug}.html`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Wallection/1.0" },
    });

    if (!response.ok) {
      throw new Error(`Wallpapers.com error: ${response.status}`);
    }

    const html = await response.text();
    const images = parseJsonLd(html);

    if (images.length > 0) {
      const wallpaper = transformWpcomImage(images[0]!);
      if (wallpaper) {
        await cacheSet(cacheKey, wallpaper, CACHE_TTL.LONG);
        return wallpaper;
      }
    }

    return null;
  } catch (error) {
    logError(`Failed to fetch Wallpapers.com wallpaper: ${slug}`, error as Error);
    return null;
  }
}

export async function searchWpcomWallpapers(
  query: string,
  page: number = 1
): Promise<{ wallpapers: Wallpaper[]; page: number; totalResults: number }> {
  const cacheKey = `wpcom:search:${query.toLowerCase()}:${page}`;
  const cached = await cacheGet<{ wallpapers: Wallpaper[]; page: number; totalResults: number }>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://wallpapers.com/search?q=${encodeURIComponent(query)}&p=${page}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Wallection/1.0" },
    });

    if (!response.ok) {
      throw new Error(`Wallpapers.com search error: ${response.status}`);
    }

    const html = await response.text();
    const images = parseJsonLd(html);

    const wallpapers: Wallpaper[] = [];
    for (const item of images) {
      const wallpaper = transformWpcomImage(item);
      if (wallpaper) {
        wallpapers.push(wallpaper);
      }
    }

    const result = { wallpapers, page, totalResults: wallpapers.length };
    await cacheSet(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  } catch (error) {
    logError(`Failed to search Wallpapers.com: ${query}`, error as Error);
    throw error;
  }
}
