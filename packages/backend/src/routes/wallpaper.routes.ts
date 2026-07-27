import type { FastifyInstance } from "fastify";
import {
  getWallpapers,
  getWallpapersBatch,
  getWallpaper,
  getSimilar,
  search,
  getTrendingSearches,
} from "../controllers/wallpaper.controller.js";

export async function wallpaperRoutes(app: FastifyInstance): Promise<void> {
  app.get("/wallpapers", getWallpapers);
  app.get("/wallpapers/batch", getWallpapersBatch);
  app.get("/wallpaper/:id", getWallpaper);
  app.get("/wallpaper/:id/similar", getSimilar);
  app.get("/search", search);
  app.get("/search/trending", getTrendingSearches);
}
