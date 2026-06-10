import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

setup('authenticate', async ({ page, baseURL }) => {

  // 填入帳號密碼
  const username = process.env.FSUSERNAME;
  const password = process.env.FSPASSWORD;

  if (!username || !password) {
    throw new Error('USERNAME or PASSWORD not set in .env file');
  }

  await page.goto(`${baseURL}`);

  await page.waitForLoadState('networkidle');

  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  await page.click('button[type="submit"]');

  // 等待登入完成，URL改變到sites頁面
  // await expect(page).toHaveURL(/sites/);
  // await page.waitForURL(/sites/);
  await expect(page.locator('text=Sites')).toBeVisible();
  console.log(`[Auth Setup] Successfully logged in to Stage`);

  // 保存session到根據STAGE命名的文件
  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });

  console.log(`[Auth Setup] Session saved to playwright/.auth/user.json`);
});