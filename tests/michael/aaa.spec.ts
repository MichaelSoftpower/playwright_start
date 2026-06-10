import { test, expect } from '@playwright/test';
import { ensureAuth } from './helpers/login/ensureAuth';
import { siteCheck } from './helpers/login/siteCheck';

// $PWDEBUG=1 STAGE=5 npx playwright test --project=aaa
// STAGE=1 npx playwright test --project=aaa

// const SITE_NAME = 'Michael Test Site';
const SITE_NAME = 'Softpower';

test.describe('Test Helper Functions', () => {
    test('helpTest', async ({ page, baseURL }) => {
        // Step 1: Ensure authentication
        await siteCheck(page, baseURL, SITE_NAME);

        await page.goto(`${baseURL}/#/orders/create`);

        await page.pause()

    })
});