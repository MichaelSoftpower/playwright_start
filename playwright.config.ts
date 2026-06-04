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
    launchOptions: {
      // 關閉瀏覽器自動翻譯提示
      args: [
        '--disable-features=Translate',
        '--disable-translate',
        '--lang=en-US',
      ],
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