import type { FastifyInstance } from "fastify";
import { CATEGORIES, getCategoryBySlug, searchCategories } from "../config/categories";

export async function categoryRoutes(app: FastifyInstance): Promise<void> {
  app.get("/categories", async () => {
    return { categories: CATEGORIES };
  });

  app.get("/categories/search", async (request) => {
    const { q } = request.query as { q: string };
    if (!q) return { categories: CATEGORIES };
    return { categories: searchCategories(q) };
  });

  app.get("/categories/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const category = getCategoryBySlug(slug);
    if (!category) {
      return reply.status(404).send({ error: "Category not found" });
    }
    return { category };
  });
}
