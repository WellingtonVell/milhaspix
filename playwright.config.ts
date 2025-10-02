import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./_e2e_",
  testMatch: "_e2e_/*.spec.{ts,tsx}",
  outputDir: "_e2e_/results",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "_e2e_/report" }],
  ],

  use: {
    baseURL: "http://localhost:3000",
    screenshot: "on",
    video: "on-first-retry",
    trace: "on-first-retry",
  },

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    { name: "Desktop Chrome", use: devices["Desktop Chrome"] },
    { name: "Desktop Firefox", use: devices["Desktop Firefox"] },
    { name: "Desktop Safari", use: devices["Desktop Safari"] },
    { name: "Mobile Chrome", use: devices["Pixel 5"] },
    { name: "Mobile Safari", use: devices["iPhone 12"] },
  ],
});
