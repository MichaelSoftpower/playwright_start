import { test, expect, Page } from '@playwright/test';
// npx playwright test tests/michael/HealthCheck.spec.ts
// ============================================================
// 設定區
// ============================================================

const BASE_URL = 'https://bos-asg.friendlysky.com'; // ← 換成測試環境 URL，確保不要指向正式環境

const LOGIN_URL = `${BASE_URL}/login`;
const SITE_NAME = 'softpower';

const AUTH = {
    username: 'michael@softpower.com.tt',      // ← 換成帳號
    password: '555aaasss',   // ← 換成密碼
};

// ============================================================
// 頁面類型定義
// ============================================================

interface RouteConfig {
    name: string;
    path: string;
    searchButtonText?: string; // 預設 'Search'
};

// ============================================================
// 路由清單 — 依需求新增 / 修改
// ============================================================

const ROUTES: RouteConfig[] = [
    // --- 基本頁面（進去沒報錯即通過）---
    { name: 'Create Order', path: '/orders/create' },
    { name: 'Main Event', path: '/events' },
    { name: 'Find Order', path: '/orders' },
    { name: 'Site Setting', path: '/settings/site/update' },
    { name: 'Find User', path: '/users' },
];

// ============================================================
// 錯誤偵測：主控台 & 頁面關鍵字
// ============================================================

const JS_ERROR_IGNORE = [
    /favicon/i,
    /gtag/i,
    /analytics/i,
];

const PAGE_ERROR_KEYWORDS = [
    '500', 'Internal Server Error', 'Unhandled', 'Exception',
    'Something went wrong', 'Error:', 'Traceback',
];

// ============================================================
// Helper：登入與檢查
// ============================================================
async function healthCheckLogin(page: Page, baseURL: string) {
    await page.goto(LOGIN_URL);
    await page.getByLabel(/username|email|帳號/i).fill(AUTH.username);
    await page.getByLabel(/password|密碼/i).fill(AUTH.password);
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL(new RegExp(LOGIN_URL), { timeout: 10000 });

    const needSelectSite = page.url().includes('#/sites');

    if (needSelectSite) {
        console.log('無 site session，選擇指定 site');
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('textbox', { name: 'filter name' }).fill(SITE_NAME);
        await page.getByText("Search").click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('cell', { name: SITE_NAME }).click();
        await page.waitForLoadState('networkidle');
    } else {
        console.log('site session 仍有效，直接進入');
    }
    await page.waitForSelector('aside.main-sidebar a[href="#/events"]', {
        timeout: 15000,
    });
};

// ============================================================
// Helper：收集頁面錯誤
// ============================================================

function attachErrorCollector(page: Page): () => string[] {
    const errors: string[] = [];

    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            if (!JS_ERROR_IGNORE.some((re) => re.test(text))) {
                errors.push(`[console.error] ${text}`);
            }
        }
    });

    page.on('pageerror', (err) => {
        errors.push(`[pageerror] ${err.message}`);
    });

    page.on('response', (res) => {
        if (res.status() >= 500) {
            errors.push(`[HTTP ${res.status()}] ${res.url()}`);
        }
    });

    return () => errors;
};

// ============================================================
// Helper：掃描頁面文字是否含錯誤關鍵字
// ============================================================

async function assertNoPageErrors(page: Page, collectedErrors: string[]) {
    // 1. JS / 網路錯誤
    expect(
        collectedErrors,
        `發現以下錯誤:\n${collectedErrors.join('\n')}`
    ).toHaveLength(0);

    // 2. 頁面可見文字錯誤關鍵字
    const body = await page.locator('body').innerText().catch(() => '');
    for (const kw of PAGE_ERROR_KEYWORDS) {
        expect(body, `頁面出現錯誤關鍵字: "${kw}"`).not.toContain(kw);
    }
};

// ============================================================
// 主測試群組：逐一跑 ROUTES
// ============================================================

test.describe('BOS 系統功能健康檢查', () => {
    test('逐一掃描所有功能頁面', async ({ page }) => {
        await healthCheckLogin(page, BASE_URL);
        await page.goto(`${BASE_URL}/bos/#/dashboard`);
        await page.waitForSelector('aside.main-sidebar a[href="#/events"]', {
            timeout: 50000,
        });
        const results: { name: string; path: string; errors: string[] }[] = [];
        for (const route of ROUTES) {
            const getErrors = attachErrorCollector(page);

            // 1. 前往頁面
            await page.goto(`${BASE_URL}/bos/#${route.path}`);
            // 2. 等 URL 確實切換到目標路徑（防止還停在上一頁）
            await page.waitForURL(`**/#${route.path}`, { timeout: 10000 });
            // 3. 等舊內容清掉、新內容開始渲染
            //    Angular router-outlet 切換時會短暫移除子元素
            await page.waitForSelector('.content-wrapper', {
                state: 'hidden',   // 先等它消失（或跳過，視框架行為而定）
                timeout: 3000,
            }).catch(() => { });  // 有些頁面不會消失直接換內容，忽略

            await page.waitForSelector('.content-wrapper', {
                state: 'visible',  // 再等新內容出現
                timeout: 10000,
            });

            // 4. 等頁面內 API 資料載入完成
            await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });


            // 5. 截圖（可選，方便人工確認）
            await page.screenshot({
                path: `test-results/screenshots/${route.name.replace(/\s+/g, '_')}.png`,
                fullPage: true,
            });
            // 6. 錯誤判斷
            results.push({ name: route.name, path: route.path, errors: getErrors() });
            // await assertNoPageErrors(page, getErrors());
        };
        // 全部跑完後統一報告
        const failed = results.filter((r) => r.errors.length > 0);
        console.log('\n========== 掃描結果 ==========');
        results.forEach((r) => {
            if (r.errors.length === 0) {
                console.log(`✅ ${r.name} (${r.path})`);
            } else {
                console.log(`❌ ${r.name} (${r.path})\n   ${r.errors.join('\n   ')}`);
            }
        });
        expect(
            failed.map((r) => `${r.name}: ${r.errors.join(', ')}`),
            `以下頁面有錯誤:\n${failed.map((r) => r.path).join('\n')}`
        ).toHaveLength(0);
    });
});