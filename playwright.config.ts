import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: ["**/visual.spec.ts", "**/performance.spec.ts"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : [["list"]],
  use: {
    baseURL,
    reducedMotion: "reduce",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: [
        "**/cross-browser.spec.ts",
        "**/visual.spec.ts",
        "**/performance.spec.ts",
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: ["**/cross-browser.spec.ts"],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: ["**/cross-browser.spec.ts"],
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.CI ? "npm run start" : "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
