import type { FastifyRequest, FastifyReply } from "fastify";
import { getHomepage } from "../services/homepage.service.js";

export async function getHomepageWallpapers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const homepage = await getHomepage();
    return homepage;
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ error: "Failed to generate homepage" });
  }
}
