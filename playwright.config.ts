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
    // 以npx playwright test --project=mtest 指令時會執行這個project裡的測試
    {
      name: 'mtest',
      // 執行/tests/michael下的測試檔案
      testDir: './tests/michael',
      testMatch: '**/michael/**/*.spec.ts',
      // testMatch:'./tests/michael'
    },
  ]
});