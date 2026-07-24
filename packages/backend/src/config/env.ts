import { z } from "zod";

const envSchema = z.object({
  WALLHAVEN_API_KEY: z.string().optional(),
  BACKEND_PORT: z.coerce.number().default(3001),
  BACKEND_HOST: z.string().default("0.0.0.0"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
