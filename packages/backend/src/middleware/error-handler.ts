import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;

  reply.status(statusCode).send({
    error: error.message || "Internal Server Error",
    code: error.code,
    ...(process.env.NODE_ENV !== "production" && { details: error.stack }),
  });
}
