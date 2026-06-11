import { Page, expect } from '@playwright/test';
import { waitForReportResponse } from './waitForReportResponse';

// ============================================================
// Helper：點擊 Search 按鈕
// ============================================================

export async function clickSearch(
    page: Page,
    btnText = 'Search',
    reportName: string,
    apiPattern: RegExp = /\/rest\//,
): Promise<void> {
    await page.waitForTimeout(1000);
    const btn = page.getByRole('button', { name: new RegExp(btnText, 'i') });
    await expect(btn).toBeVisible({ timeout: 5000 });

    const clickTime = Date.now();
    console.log(`[${new Date(clickTime).toISOString()}] ${reportName}, 點擊 Search`);

    // 同時觸發點擊與等待 API，避免 race condition
    await Promise.all([
        waitForReportResponse(page, reportName, apiPattern),
        btn.click(),
    ]);

    // API 回應後等畫面真正渲染完成
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
    await page.waitForTimeout(3000); // Angular 渲染緩衝

    const renderTime = Date.now();
    console.log(`[${new Date(renderTime).toISOString()}] ${reportName}, 渲染完成，耗時 ${renderTime - clickTime}ms`);
}