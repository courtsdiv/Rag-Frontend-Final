import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  use: {
    headless: false,
    launchOptions: {
      slowMo: 800,
    },
    trace: "on-first-retry",

    coverage: {
      enabled: true,
      reporter: ["json", "html"],
    },
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
  ],
});
