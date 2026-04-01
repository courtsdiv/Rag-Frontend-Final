import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Let tests use baseURL, so we can do: page.goto('/')
  use: {
    headless: false,
    launchOptions: {
      slowMo: 800,
    },
    trace: 'on-first-retry',

    coverage: {
      enabled: true,
      reporter: ['json', 'html'],
    },

    baseURL: 'http://localhost:5173',
  },

  // Automatically start the frontend dev server for tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: false,
        launchOptions: {
          slowMo: 800,
        },
      },
    },
  ],
});