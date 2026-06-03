import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60000,

  use: {
    headless: false,
    viewport: {
      width: 1440,
      height: 900,
    },
  },

  projects: [
    {
      name: 'mtest',
      // testMatch: '**/*.spec.ts',
      testMatch: /.*michaelTest\.spec\.ts/,
    },
  ]
});