import type { FastifyInstance } from "fastify";

export interface RejectionLog {
  wallpaperId: string;
  title: string;
  tags: string[];
  reason: string;
  timestamp: string;
}

let appLogger: FastifyInstance["log"] | null = null;

export function initLogger(logger: FastifyInstance["log"]): void {
  appLogger = logger;
}

export function logRejection(rejection: RejectionLog): void {
  if (!appLogger) {
    console.warn("[Logger] Not initialized. Rejection:", rejection);
    return;
  }

  appLogger.warn(
    {
      wallpaperId: rejection.wallpaperId,
      title: rejection.title,
      tags: rejection.tags,
      reason: rejection.reason,
    },
    `[ContentFilter] Rejected wallpaper: ${rejection.wallpaperId}`
  );
}

export function logInfo(message: string, data?: Record<string, unknown>): void {
  if (!appLogger) {
    console.log(`[Info] ${message}`, data);
    return;
  }

  appLogger.info(data || {}, message);
}

export function logError(message: string, error: Error, data?: Record<string, unknown>): void {
  if (!appLogger) {
    console.error(`[Error] ${message}`, error, data);
    return;
  }

  appLogger.error({ err: error, ...data }, message);
}
