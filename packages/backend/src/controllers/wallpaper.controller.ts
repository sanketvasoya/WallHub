import type { FastifyRequest, FastifyReply } from "fastify";
import { getCategoryBySlug } from "../config/categories";
import {
  getWallpapersByCategory,
  getWallpaperById,
  getSimilarWallpapers,
  searchWallpapers,
} from "../services/wallpaper.service";

interface WallpaperQuery {
  category?: string;
  sort?: string;
  page?: string;
}

interface BatchQuery {
  ids?: string;
}

interface WallpaperParams {
  id: string;
}

interface SimilarQuery {
  page?: string;
}

interface SearchQuery {
  q?: string;
  sort?: string;
  page?: string;
}

export async function getWallpapers(
  request: FastifyRequest<{ Querystring: WallpaperQuery }>,
  reply: FastifyReply
) {
  const {
    category = "trending",
    sort = "hot",
    page = "1",
  } = request.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  const cat = getCategoryBySlug(category);
  if (!cat) {
    return reply.status(404).send({ error: "Category not found" });
  }

  try {
    return await getWallpapersByCategory(
      category,
      sort,
      pageNum,
      cat.wallhavenTags,
      cat.wallhavenCategories
    );
  } catch (error: any) {
    request.log.error(error);
    if (error?.statusCode === 429) {
      reply.header("Retry-After", error.retryAfter || "30");
      return reply.status(429).send({ error: "Rate limited by Wallhaven", retryAfter: error.retryAfter });
    }
    return reply.status(502).send({ error: "Failed to fetch wallpapers" });
  }
}

export async function getWallpapersBatch(
  request: FastifyRequest<{ Querystring: BatchQuery }>,
  reply: FastifyReply
) {
  const { ids } = request.query;

  if (!ids || ids.trim().length === 0) {
    return reply.status(400).send({ error: "ids parameter is required" });
  }

  const idList = ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 50);

  try {
    const results = await Promise.allSettled(
      idList.map((id) => getWallpaperById(id))
    );

    const wallpapers = results
      .filter((r): r is PromiseFulfilledResult<import("../types/index").Wallpaper> => r.status === "fulfilled")
      .map((r) => r.value);

    return { wallpapers };
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ error: "Failed to fetch wallpapers" });
  }
}

export async function getWallpaper(
  request: FastifyRequest<{ Params: WallpaperParams }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    return await getWallpaperById(id);
  } catch (error) {
    request.log.error(error);
    return reply.status(404).send({ error: "Wallpaper not found" });
  }
}

export async function getSimilar(
  request: FastifyRequest<{ Params: WallpaperParams; Querystring: SimilarQuery }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const { page = "1" } = request.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  try {
    return await getSimilarWallpapers(id, pageNum);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ error: "Failed to fetch similar wallpapers" });
  }
}

export async function search(
  request: FastifyRequest<{ Querystring: SearchQuery }>,
  reply: FastifyReply
) {
  const { q, sort = "relevance", page = "1" } = request.query;

  if (!q || q.trim().length === 0) {
    return reply.status(400).send({ error: "Search query is required" });
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  try {
    return await searchWallpapers(q.trim(), sort, pageNum);
  } catch (error: any) {
    request.log.error(error);
    if (error?.statusCode === 429) {
      reply.header("Retry-After", error.retryAfter || "30");
      return reply.status(429).send({ error: "Rate limited by Wallhaven", retryAfter: error.retryAfter });
    }
    return reply.status(502).send({ error: "Search failed" });
  }
}

export async function getTrendingSearches() {
  return {
    trending: [
      "mountains",
      "space",
      "nature",
      "cyberpunk",
      "minimal",
      "anime",
      "sunset",
      "ocean",
      "forest",
      "dark",
      "neon",
      "galaxy",
      "city",
      "abstract",
      "amoled",
    ],
  };
}
