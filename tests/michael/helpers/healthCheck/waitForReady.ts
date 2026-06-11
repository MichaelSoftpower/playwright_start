import { Page } from '@playwright/test';

// ============================================================
// Helper：等待頁面渲染完成（不依賴 API pattern）
// 策略：networkidle → Angular isStable → 緩衝
// 供 basic 頁面用
// ============================================================
interface AngularTestability {
    isStable(): boolean;
}

declare global {
    interface Window {
        getAllAngularTestabilities?: () => AngularTestability[];
    }
}
export async function waitForPageReady(
    page: Page,
    routeName: string,
): Promise<void> {
    const t0 = Date.now();
    console.log(`[${new Date(t0).toISOString()}] ${routeName}, 等待頁面就緒`);

    // 第一層：等網路請求平息
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.warn(`[waitForPageReady] ${routeName}: networkidle timeout，繼續下一層`);
    });

    // 第二層：等 Angular zone 穩定（change detection 完成）
    await page.waitForFunction(
        () => {
            const win = window;
            if (typeof win.getAllAngularTestabilities !== 'function') return true; // 非 Angular 頁面直接通過
            return win.getAllAngularTestabilities().every((t) => t.isStable());
        },
        { timeout: 5000 },
    ).catch(() => {
        console.warn(`[waitForPageReady] ${routeName}: Angular isStable timeout，繼續下一層`);
    });

    // 第三層：固定緩衝，給最後的 DOM patch 與動畫完成時間
    await page.waitForTimeout(5000);

    console.log(`[${new Date().toISOString()}] ${routeName}, 頁面就緒，耗時 ${Date.now() - t0}ms`);
}