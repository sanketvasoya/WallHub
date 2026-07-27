import type { FastifyInstance } from "fastify";
import { getRedis } from "../config/redis.js";

export async function analyticsRoutes(app: FastifyInstance): Promise<void> {
  app.post("/analytics/page-view", async (request, reply) => {
    const { path, referrer } = request.body as { path: string; referrer?: string };
    const redis = getRedis();

    if (!redis) {
      return reply.status(200).send({ ok: true });
    }

    const date = new Date().toISOString().split("T")[0];
    const key = `analytics:pageviews:${date}`;

    try {
      await redis.zincrby(key, 1, path);
      await redis.expire(key, 86400 * 7); // 7 day retention

      if (referrer) {
        const refKey = `analytics:referrers:${date}`;
        await redis.zincrby(refKey, 1, referrer);
        await redis.expire(refKey, 86400 * 7);
      }

      return { ok: true };
    } catch (error) {
      request.log.error(error);
      return { ok: true }; // Don't fail the client for analytics
    }
  });

  app.get("/analytics/pageviews", async (request, reply) => {
    const redis = getRedis();
    if (!redis) {
      return reply.status(200).send({ data: [] });
    }

    const { date } = request.query as { date?: string };
    const d = date || new Date().toISOString().split("T")[0];
    const key = `analytics:pageviews:${d}`;

    try {
      const data = await redis.zrevrange(key, 0, 19, "WITHSCORES");
      const result: { path: string; views: number }[] = [];
      for (let i = 0; i < data.length; i += 2) {
        result.push({ path: data[i], views: parseInt(data[i + 1], 10) });
      }
      return { data: result };
    } catch (error) {
      request.log.error(error);
      return { data: [] };
    }
  });
}
