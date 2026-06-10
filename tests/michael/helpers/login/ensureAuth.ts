import { Page } from '@playwright/test';
import { multiAuthLogin } from './multiAuthLogin';

// 判定是否保持登入Session
// 若無，則呼叫multiAuthLogin，完成登入動作後將Session存到user.json
export async function ensureAuth(page: Page, baseURL: string) {
    await page.goto(`${baseURL}/#/dashboard`);
    await page.waitForLoadState('networkidle');

    // session expired
    if (page.url().includes('/login')) {
        console.log('[Session Validation]🔄 Session expired. Re-login...');
        await multiAuthLogin(page, baseURL);
        console.log('[Session Validation]✅ Authentication state updated.');
    }
    else {
        console.log('[Session Validation]✅ Session valid. No action needed.');
    }
};