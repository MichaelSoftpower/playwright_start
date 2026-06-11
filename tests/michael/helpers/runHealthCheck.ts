import { expect } from 'playwright/test';
import { HealthCheck_Routes } from './check/checkRouter';
import { setDateRange } from './healthCheck/setDateRange';
import { clickSearch } from './healthCheck/clickSearch';
import { takeScreenshot } from './healthCheck/takeScreenshot';
import { attachErrorCollector } from './check/errorCheck';
// import { waitForReportResponse } from './waitForReportResponse';
import { waitForPageReady } from './healthCheck/waitForReady';

const REPORTS_PATTERN = /\/rest\//;

export async function runHealthCheck(
    page,
    baseURL: string,
    date_from: string = '2023/01/01',
    date_to: string = '2026/12/31',
) {
    console.log(`健康度檢查開始，本次將測試: ${HealthCheck_Routes.length} 個頁面`);
    const results: {
        name: string;
        path: string;
        errors: string[];
        noData: boolean;
        navigated: boolean;
    }[] = [];

    for (const [i, route] of HealthCheck_Routes.entries()) {
        const label = `${String(i + 1).padStart(2, '0')}_${route.name}`;

        // ✅ attachErrorCollector 在 try 外宣告，確保 catch 後仍可呼叫 getErrors/detach
        const { getErrors, isNoData, detach } = attachErrorCollector(page);
        let navigated = false;

        try {
            await page.goto(`${baseURL}/#${route.path}`);
            console.log(`前往 ${label} 中`);
            await page.waitForURL(`**/#${route.path}`, { timeout: 5000 });
            console.log(`抵達 ${label} 頁面`);
            navigated = true;

            await page.waitForLoadState('networkidle', { timeout: 10000 });

            if (route.type === 'basic') {
                // 每個 basic route 應在 checkRouter 指定 apiPattern
                // 未指定時 fallback 到 networkidle（已在上面等過）
                // if (route.apiPattern) {
                await waitForPageReady(page, route.name);
                // }
            }

            if (route.type === 'search-with-date') {
                await setDateRange(page, date_from, date_to);
                // search-with-date 統一等 /rest/reports/；如有特殊需求可在 route 指定 apiPattern 覆寫
                await clickSearch(page, 'Search', route.name, route.apiPattern ?? REPORTS_PATTERN);
            }

            await takeScreenshot(page, label);

        } catch (e) {
            console.error(`[FAILED] ${label}: ${(e as Error).message}`);
            await takeScreenshot(page, `${label}_ERROR`);
        } finally {
            // 無論成功或失敗，都移除本頁監聽器，防止污染下一頁
            detach();
        }

        const pageErrors = getErrors();
        const pageNoData = isNoData();
        results.push({
            name: route.name,
            path: route.path,
            errors: pageErrors,
            noData: pageNoData,
            navigated,
        });
        detach();

        if (pageNoData) {
            console.warn(`⚠️  ${route.name} (${route.path}) — 查無資料 (No data found)`);
        } else if (pageErrors.length > 0) {
            console.warn(`❌  ${label} 有 ${pageErrors.length} 個頁面錯誤:`);
            pageErrors.forEach((err) => console.warn(`   • ${err}`));
        }
    }

    // ─── 全部跑完後統一報告 ───────────────────────────────────────────
    const failed = results.filter((r) => r.errors.length > 0);
    const skipped = results.filter((r) => !r.navigated);

    console.log('\n========== 掃描結果 ==========');
    results.forEach((r) => {
        if (r.errors.length > 0) {
            console.log(`❌ ${r.name} (${r.path})\n   ${r.errors.join('\n   ')}`);
        } else if (r.noData) {
            console.log(`⚠️  ${r.name} (${r.path}) — 查無資料 (No data found)`);
        } else {
            console.log(`✅ ${r.name} (${r.path})`);
        }
    });

    if (skipped.length > 0) {
        console.log(`\n⚠️  以下 ${skipped.length} 個頁面導覽失敗（截圖仍已儲存）:`);
        skipped.forEach((r) => console.log(`   • ${r.name} (${r.path})`));
    }

    console.log(`\n健康度檢查結束，請至 screenshots 資料夾確認截圖`);

    // ✅ 最後統一 assert，不會中途中斷迴圈
    expect(
        failed.map((r) => `${r.name}: ${r.errors.join(', ')}`),
        `以下頁面有錯誤:\n${failed.map((r) => r.path).join('\n')}`,
    ).toHaveLength(0);
}

export { HealthCheck_Routes } from './check/checkRouter';