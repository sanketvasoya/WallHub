import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT) || 3000;
const BACKEND_PORT = Number(process.env.BACKEND_PORT) || 3001;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  webServer: [
    {
      command: "cd ../.. && pnpm --filter @wallection/backend dev",
      port: BACKEND_PORT,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: "pnpm dev",
      port: PORT,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
