import { Page, test, expect } from '@playwright/test';

// npx playwright test tests/michaelTest.spec.ts
// npx playwright test --project=mtest

test.describe('Test Helper Functions', () => {
  test('helpTest', async ({ page }) => {
    await page.goto('https://stage5.friendlysky.com/event?e=69m');
    await page.pause()
    await page.waitForLoadState('networkidle');
    await page.getByRole('row', { name: 'Heavy Event Aug.08', exact: true }).click();
    await expect(page).toHaveURL(/heavy-event-aug08-08-08-2026-0930/);
    await page.pause()
    await page.locator('a').filter({ hasText: 'Ticket' }).click();
    await expect(page).toHaveURL(/\/ticket\/seg/);
    await page.pause()
    const sectionA = page.getByText('Section Alpha', { exact: true });
    await sectionA
      .locator('dropdown')
      .click();

  });
})