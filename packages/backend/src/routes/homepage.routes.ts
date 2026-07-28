import type { FastifyInstance } from "fastify";
import { getHomepageWallpapers } from "../controllers/homepage.controller.js";

export async function homepageRoutes(app: FastifyInstance): Promise<void> {
  app.get("/homepage", getHomepageWallpapers);
}
