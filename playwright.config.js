import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ...existing config...

  use: {
    headless: false,
    launchOptions: {
      slowMo: 800,
    },
    trace: 'on-first-retry',

    // merged in from the second `use:` block
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