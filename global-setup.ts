import fs from 'fs';

// 配合登入session用，新環境尚未建起playwright/.auth/user.json
// 此檔案先依照格式建立檔案，供後續自動登入使用
// 使用session寫在playwright.config.ts的use:storageState

export default async function globalSetup() {
  const AUTH_PATH = 'playwright/.auth/user.json';
  if (!fs.existsSync(AUTH_PATH)) {
    fs.mkdirSync('playwright/.auth', { recursive: true });
    fs.writeFileSync(AUTH_PATH, JSON.stringify({ cookies: [], origins: [] }));
    console.log('[Global Setup] 📁 Created empty auth placeholder.');
  }
}