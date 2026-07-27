import type { FastifyInstance } from "fastify";
import { COLLECTIONS, getCollectionBySlug } from "../config/collections.js";
import { searchWallpapers } from "../services/wallpaper.service.js";

export async function collectionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/collections", async () => {
    return { collections: COLLECTIONS };
  });

  app.get("/collections/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const collection = getCollectionBySlug(slug);
    if (!collection) {
      return reply.status(404).send({ error: "Collection not found" });
    }

    const { page = "1" } = request.query as { page?: string };
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    try {
      const result = await searchWallpapers(collection.query, collection.sorting, pageNum);
      return {
        collection,
        wallpapers: result.wallpapers,
        totalResults: result.totalResults,
        page: pageNum,
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(502).send({ error: "Failed to fetch collection wallpapers" });
    }
  });
}
