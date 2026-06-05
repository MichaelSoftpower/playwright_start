import { expect, Page } from '@playwright/test';


export async function easyLogin(page: Page, baseURL: string,
    AUTH: { auUsername: string, auPassword: string }) {
    const LOGIN_URL = `${baseURL}/login`;

    await page.goto(LOGIN_URL);
    await page.waitForTimeout(1000);
    await page.getByLabel(/username|email|帳號/i).fill(AUTH.auUsername);
    await page.getByLabel(/password|密碼/i).fill(AUTH.auPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(url => !url.href.includes('#/login'), { timeout: 10000 });

    await page.waitForLoadState('domcontentloaded');
    console.log(page.url());
    await page.pause
}