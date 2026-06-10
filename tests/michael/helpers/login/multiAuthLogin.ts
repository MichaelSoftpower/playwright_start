import { expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * 從 baseURL 或環境變數解析當前 stage 編號。
 *
 * 優先順序：
 *   1. 環境變數 STAGE（如 STAGE=5）
 *   2. 從 baseURL hostname 解析，例如 stage5.fsky.com → "5"
 *   3. 預設回傳 "1"
 *
 * ⚠️ 注意：stage.fsky.com（無數字）會解析為 "1"，
 *    因為 regex match[1] 為空字串，fallback 到 '1'。
 *    若 stage.fsky.com 是獨立環境而非 stage1 的別名，
 *    需要調整此邏輯。
 */

const resolveStage = (baseURL?: string): string => {
  if (process.env.STAGE) return process.env.STAGE;
  if (!baseURL) return '1';

  try {
    const host = new URL(baseURL).hostname;
    const match = host.match(/^stage(\d*)\.friendlysky\.com$/i);
    if (!match) return '1';
    return match[1] || '1';
  } catch {
    return '1';
  }
};
// 回傳 auth 狀態檔案的儲存路徑。
const getAuthPath = (): string => {
  const dir = path.join('playwright', '.auth');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'user.json');
};

// 執行登入流程並將 session 狀態存檔。
// 使用 .env 中的 FSUSERNAME / FSPASSWORD 進行登入，
// 登入成功後以 storageState 儲存 cookies 與 localStorage。

export async function multiAuthLogin(
  page: Page,
  baseURL: string
): Promise<void> {

  const stage = resolveStage(baseURL);
  const stageAuthPath = getAuthPath();

  const username = process.env.FSUSERNAME;
  const password = process.env.FSPASSWORD;

  if (!username || !password) {
    throw new Error('❌ USERNAME or PASSWORD not set in .env file');
  }

  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.click('button[type="submit"]');

  // 確認登入成功：URL 應包含 dashboard 或 sites
  await expect(page).toHaveURL(/dashboard|sites/);

  // 儲存整個 context 的 session 狀態
  await page.context().storageState({ path: stageAuthPath });

  console.log(`[Auth Setup] ✅ Successfully logged in for Stage ${stage} (${baseURL})`);
};

