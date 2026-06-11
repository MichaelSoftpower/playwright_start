import { Page, expect } from '@playwright/test';

// ============================================================
// Helper：填日期
// const DATE_RANGE = {
//     from: '2023/01/01',
//     to: '2026/12/31',
// };
// ============================================================

export async function setDateRange(
    page: Page,
    from: string,
    to: string,
    labelText: string = 'Event Date',
) {
    await page.waitForTimeout(1000);
    await page.evaluate(
        ({ s, e, label }) => {
            const $ = (window as any).$;
            // 抓有 Event Date 的 .fields
            const eventDateGroup = [...document.querySelectorAll<HTMLElement>('div.fields')]
                .find(el => el.querySelector('label')?.textContent.trim() === label);
            if (!eventDateGroup) throw new Error(`找不到 label "${label}"`);

            const [fromField, toField] =
                [...eventDateGroup.querySelectorAll<HTMLElement>(':scope > div.field')];
            if (!fromField || !toField) throw new Error('找不到 from / to 欄位');

            const fromPicker = $(fromField.querySelector('input')).pickadate('picker');
            const toPicker = $(toField.querySelector('input')).pickadate('picker');

            fromPicker.set('select', new Date(s));
            toPicker.set('select', new Date(e));
        },
        { s: from, e: to, label: labelText }
    );
}