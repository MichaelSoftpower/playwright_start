import { Page } from "playwright";

export async function takeScreenshot(page: Page, name: string) {
    await page.waitForSelector('table, .result, .report-content', {
        timeout: 15000,
    }).catch(() => {
        // 找不到結果容器也繼續，截圖留存人工確認
        console.warn(`⚠️  ${name} 等不到結果容器，直接截圖`);
    });
    const screenshotTime = Date.now();
    console.log(`[${new Date(screenshotTime).toISOString()}]✅ ${name}: 截圖完成`);
    await page.screenshot({
        path: `test-results/screenshots/${name.replace(/\s+/g, '_')}.png`,
        fullPage: true,
    });
}