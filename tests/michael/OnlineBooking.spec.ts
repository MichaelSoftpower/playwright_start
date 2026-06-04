import { Page, test, expect } from '@playwright/test';

// npx playwright test tests/michael/OnlineBooking.spec.ts
// npx playwright test --project=mtest

test.describe('Online Booking', () => {
  test('basic workflow', async ({ page }) => {
    // 先從固定Main Event開始，也能用網址直連Event
    // await page.goto('https://stage5.friendlysky.com/event?e=69m');
    // await page.pause()
    // await page.waitForLoadState('networkidle');
    // await page.getByRole('row', { name: 'Heavy Event Aug.08', exact: true }).click();
    // 直連Event的話 改goto('https://stage5.friendlysky.com/event/heavy-event-aug08-08-08-2026-0930?e=69m')
    // 這邊拿網址文字比對作為確認是否有連到正確的Event頁面
    // await expect(page).toHaveURL(/heavy-event-aug08-08-08-2026-0930/);
    // await page.pause()
    // 選商品Ticket
    // await page.locator('a').filter({ hasText: 'Ticket' }).click();

    await page.goto('https://stage5.friendlysky.com/event/heavy-event-aug08-08-08-2026-0930/ticket/seg?e=69m');
    await expect(page).toHaveURL(/\/ticket\/seg/);
    await page.pause()
    // 從指定的Section開始，這邊是用Section名稱來定位，當然也可以用其他元素特徵來定位
    const panel = page.locator('.cart-panel').filter({
      has: page.getByText('Section Alpha', { exact: true })
    });
    // 選指定的Section div裡面的dropdown點開
    await panel
      .locator('.dropdown')
      .first()
      .click();
    await page.pause()

    await panel
      .locator('[data-value="1"]')
      .first()
      .click();

    // await page
    //   .locator('.btn-for-desktop')
    //   .locator('.btn-checkout')
    //   .click();


    await page.getByRole('button', { name: 'NEXT STEP' }).click();

    await page.pause()
    await page.getByText('Confirm').click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByRole('textbox', { name: 'Mobile or Email Address' })
      .fill('michael.lin+03@friendlysky.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('000');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/ticket\/checkout/);
    await page.getByRole('radio', { name: 'Pay with cash' }).click();
    await page.getByRole('textbox', { name: 'Address*' }).fill('123 Main Street');
    await page.getByRole('textbox', { name: 'City*' }).fill('New York');
    await page.locator('select[name="state"]').selectOption('New York');
    await page.getByRole('textbox', { name: 'Zip/Postal Code*' }).fill('10001');
    await page.getByRole('textbox', { name: '2015550123' }).fill('2125550100');

    await page.getByText('Yes, I have read and accept the terms and conditions.').click();

    await page.getByRole('button', { name: 'Complete Order' }).click();
    await expect(page).toHaveURL(/\/ticket\/confirmation/);

    await expect(page.getByText('Congratulations!')).toBeVisible();
    await expect(page.getByText(/Your order number is: HLD/)).toBeVisible();


  });
})