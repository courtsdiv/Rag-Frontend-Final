import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ...existing config...
  use: {
    headless: false,
    launchOptions: {
      slowMo: 800,
    },
    trace: 'on-first-retry',
  },

  use: {
    coverage: {
      enabled: true,
      reporter: ['json', 'html'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',       
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