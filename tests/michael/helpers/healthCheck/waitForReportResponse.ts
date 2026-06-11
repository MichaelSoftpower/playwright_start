import { Page } from '@playwright/test';

// ============================================================
// Helper：等待 /rest/ API 回應並確認渲染完成
// 供 clickSearch（按鈕觸發）使用 (API流程單一且好追蹤)
// ============================================================

export async function waitForReportResponse(
    page: Page,
    routeName: string,
    apiPattern: RegExp,
): Promise<void> {
    const waitStart = Date.now();
    console.log(`[${new Date(waitStart).toISOString()}] ${routeName}, 等待 API 回應`);

    await page.waitForResponse(apiPattern, { timeout: 5000 });

    const responseTime = Date.now();
    console.log(`[${new Date(responseTime).toISOString()}] API 回應完成，耗時 ${responseTime - waitStart}ms`);

    // 等待後續連帶請求與渲染
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        // networkidle 可能 timeout，繼續後續檢查即可
    });

    const renderTime = Date.now();
    console.log(`[${new Date(renderTime).toISOString()}] 渲染完成，耗時 ${renderTime - waitStart}ms`);

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => { });
    await page.waitForTimeout(500); // 給 Angular change detection 一點緩衝
}
