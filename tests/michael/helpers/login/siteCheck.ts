import { Page } from '@playwright/test';
import { ensureAuth } from './ensureAuth'

export async function siteCheck(
    page: Page, baseURL: string,
    SITE_NAME: string,
) {
    await ensureAuth(page, baseURL)
    await page.waitForURL(url => !url.href.includes('#/login'), { timeout: 10000 });

    await page.waitForLoadState('domcontentloaded');
    console.log(page.url());
    const needSelectSite = page.url().includes('#/sites');

    if (needSelectSite) {
        console.log('[Site Session] 🔄 無 Site session，選擇指定 site');
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('textbox', { name: 'filter name' }).fill(SITE_NAME);
        await page.getByText("Search").click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('cell', { name: SITE_NAME }).click();
        await page.waitForLoadState('networkidle');
    } else {
        console.log('[Site Session] ✅ Site Session 仍有效，直接進入');
    }
    await page.waitForSelector('aside.main-sidebar a[href="#/events"]', {
        timeout: 15000,
    });
}