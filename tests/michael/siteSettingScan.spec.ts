import { test, Page } from '@playwright/test';
import { fetchAllSites } from './helpers/sitesLoader'
import { easyLogin } from './helpers/login/easyLogin';
import { navigateToSiteSetting } from './helpers/siteNavigator'

// npx playwright test tests/michael/siteSettingScan

const BASE_URL = 'https://stage5.friendlysky.com';  // ← 輸入stage網址

const AUTH = {
    auUsername: '',   // ← 輸入帳號
    auPassword: '',   // ← 輸入密碼
};

test.describe('BOS 掃描Sites Settings', () => {
    test('掃描各個Site的Settings頁面', async ({ page }) => {
<<<<<<< HEAD
=======
        
        //整體動作較長，先設定timeout值確保能夠獲得sites總數
        test.setTimeout(60000); // 1分鐘給登入與fetchAllSites

>>>>>>> michael
        // 1. 登入動作
        await easyLogin(page, BASE_URL, AUTH);

        // 2. 取得所有 site（透過 API 分頁）
        const sites = await fetchAllSites(page, BASE_URL);
        console.log(`共找到 ${sites.length} 個 site`);
        // const results = [];
<<<<<<< HEAD

        // 3. 逐一掃描
        for (const site of sites) {
            await page.getByRole('textbox', { name: 'filter name' }).fill(site.name);
            await page.getByText("Search").click();
            console.log(`🔍 掃描 Site: ${site.name} (ID: ${site.id})`);
            await navigateToSiteSetting(page, site.id, site.name, BASE_URL);
        }
    }
    );
=======
        
        test.setTimeout(sites.length * 30 * 1000); // 一個站給30秒
        const startFrom = 1;

        // 3. 逐一掃描
        for (const site of sites.slice(startFrom - 1)) {
            await navigateToSiteSetting(
                page,
                totalDigits,
                site.id,
                site.name,
                BASE_URL);
        }
    });
>>>>>>> michael
});