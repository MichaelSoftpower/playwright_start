import { test, expect } from '@playwright/test';
import { siteCheck } from './helpers/login/siteCheck';
import { runHealthCheck, HealthCheck_Routes } from './helpers/runHealthCheck';

// $PWDEBUG=1 STAGE=5 npx playwright test --project=aaa
// STAGE=1 npx playwright test tests/michael/aaa.spec.ts

// const SITE_NAME = 'Michael Test Site';
const SITE_NAME = 'Softpower';

const DATE_RANGE = {
    from: '2023/01/01',
    to: '2026/12/31',
};

test.describe('Test Helper Functions', () => {
    test('helpTest', async ({ page, baseURL }) => {
        // Step 1: Ensure authentication
        await siteCheck(page, baseURL, SITE_NAME);
        test.setTimeout(HealthCheck_Routes.length * 15000);
        await runHealthCheck(page, baseURL, DATE_RANGE.from, DATE_RANGE.to);


    })
});