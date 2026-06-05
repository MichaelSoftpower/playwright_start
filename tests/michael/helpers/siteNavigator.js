// 職責：
// 1. 點選輸入值siteName的 site
// 2. 導航到 #/settings/site/update
// 3. 等待頁面元件載入完成
// 4. 拍攝全頁
// 3. 回到 sites 列表

export async function navigateToSiteSetting(page, siteId ,siteName, baseURL) {
    await page.waitForSelector('role=cell', { timeout: 10000 });

    // 點選對應 site
    await page.getByText(siteName)
        .first()
        .click();
    // 等待 site context 切換
    await page.waitForTimeout(1000);

    // 導航到 #/settings/site/update
    await page.goto(baseURL + '/#/settings/site/update');
    await page.waitForLoadState('networkidle');

    // 等待元件讀取完成（依實際元件調整 selector）
    await page.waitForLoadState('networkidle');

    // 拍攝全頁
    await page.screenshot({
        path: `test-results/screenshots/${siteId}_${siteName.replace(/\s+/g, '_')}.png`,
        fullPage: true,
    });
    console.log(`拍攝 ${siteName}`)

    // 回到 sites 列表
    await page.goto(`${baseURL}/#/sites`);
    // await page.waitForTimeout(CONFIG.waitAfterNav);
}