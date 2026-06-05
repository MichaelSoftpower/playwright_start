import { Page, test, expect } from '@playwright/test';

// npx playwright test tests/michael/OnlineBooking.spec.ts
// npx playwright test --project=mtest

// Main Event URL，確保不要指向正式環境
const MainEvent_URL = 'https://stage5.friendlysky.com/event?e=69m';  
// Event URL，確保不要指向正式環境
const Product_URL = 'https://stage5.friendlysky.com/event/heavy-event-aug08-08-08-2026-0930/ticket/seg?e=69m'; 
const Product_name = 'Ticket';
const Section_name = 'Section Alpha';
const ticket_qty = 1;
const testusername = 'michael.lin+03@friendlysky.com';
const testpassword = '000';

test.describe('Online Booking', () => {
  test('basic workflow', async ({ page }) => {
    // 從Main Event開始，也能用網址直連Event
    // await page.goto(MainEvent_URL);
    // await page.waitForLoadState('networkidle');
    // 這邊用Event名稱來定位，當然也可以用其他元素特徵來定位
    // await page.getByRole('row', { name: 'Heavy Event Aug.08', exact: true }).click();
    // 這邊拿網址文字比對作為確認是否有連到正確的Event頁面
    // await expect(page).toHaveURL(/heavy-event-aug08-08-08-2026-0930/);
    // await page.waitForLoadState('networkidle');
    // 選商品: Ticket
    // await page.locator('a').filter({ hasText: Product_name }).click();
    await page.goto(Product_URL);
    await expect(page).toHaveURL(/\/ticket\/seg/);
    await page.pause()
    // 用Section Name定位
    const panel = page.locator('.cart-panel').filter({
      has: page.getByText(Section_name, { exact: true })
    });
    // 展開Ticket Qty
      await panel
      .locator('.dropdown')
      .first()
      .click();
    await page.pause()
    // Ticket Qty
    await panel
      .locator('[data-value="${ticket_qty}"]')
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
      .fill(testusername);
    await page.getByRole('textbox', { name: 'Password' }).fill(testpassword);
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