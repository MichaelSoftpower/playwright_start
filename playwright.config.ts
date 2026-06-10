import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// 配合.env設定的StageURL，根據命令列/環境變數 STAGE 切換登入環境 URL（1~7）
// 用法: STAGE=5 npx playwright test 路徑/檔案
const getBaseURLByStage = () => {
  const stage = process.env.STAGE || '1';
  return process.env[`STAGE_${stage}`] || process.env.BASE_URL || 'https://stage.fsky.com/bos';
};

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  workers: 1,          // 只用一個 worker
  fullyParallel: false, // 關閉並行
  globalSetup: './global-setup.ts',
  use: {
    headless: false,
    baseURL: getBaseURLByStage(),
    storageState: 'playwright/.auth/user.json',
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
}
);