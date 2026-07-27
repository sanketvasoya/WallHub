import { z } from "zod";

export const wallpaperQuerySchema = z.object({
  category: z.string().default("trending"),
  sort: z.enum(["hot", "new", "top"]).default("hot"),
  page: z.coerce.number().int().min(1).default(1),
});

export const batchQuerySchema = z.object({
  ids: z.string().min(1, "ids parameter is required"),
});

export const wallpaperParamsSchema = z.object({
  id: z.string().min(1),
});

export const similarQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200),
  sort: z.enum(["relevance", "hot", "new", "top"]).default("relevance"),
  page: z.coerce.number().int().min(1).default(1),
});

export const analyticsPageViewSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().optional(),
});

export const collectionParamsSchema = z.object({
  slug: z.string().min(1),
});

export const collectionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});
