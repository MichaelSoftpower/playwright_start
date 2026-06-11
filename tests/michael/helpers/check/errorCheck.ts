import { expect, Page } from '@playwright/test';

// ============================================================
// 忽略清單
// ============================================================

// 404 屬於「查無資料」的正常 server 回應，不視為頁面錯誤
export const HTTP_STATUS_IGNORE = [404];

// console.log 出現此格式 → 判定為「查無資料」
// 例：POST https://stage5.fsky.com/rest/reports/presale?... 404 (Not Found)
// const POST_404_PATTERN = /^POST\s+https?:\/\/.+\s+404\b/i;

// ── 查無資料的訊號（console.error，type 仍為 'error'）────────────────
// Playwright 將瀏覽器的網路錯誤一律歸為 type==='error'，不是 'log'
//
// 模式 1：POST https://...  404 (Not Found)   ← 瀏覽器 Network 層印出
// 模式 2：Failed to load resource: ... 404    ← 同上，另一種格式
const NO_DATA_PATTERNS: RegExp[] = [
  /^POST\s+https?:\/\/.+\s+404\b/i,
  /Failed to load resource:.*404/i,
];

// ── 靜默忽略清單（不算查無資料、也不算真實錯誤）────────────────────
// Angular HttpClient 在 404 後會再印一次錯誤物件，例如：
//   ERROR e
//   ERROR e {_body: '{"errorMessage":"No data found"...
// 已由上面 NO_DATA_PATTERNS 計為 noData，這裡只做靜默過濾
export const JS_ERROR_IGNORE: RegExp[] = [
  /favicon/i,
  /gtag/i,
  /analytics/i,
  /^ERROR\s+e\b/i,   // Angular HttpClient 404 後的錯誤物件
  // server 查無資料時回 404，瀏覽器會自動印這條 console.error，不視為頁面錯誤
  // /Failed to load resource:.*404/i,
];

// console.error 出現此格式 → 靜默忽略（Angular HttpClient 的 404 錯誤物件，已由 console.log 那條處理）
// 例：ERROR e {_body: '{"errorMessage":"No data found"...
// const ANGULAR_NO_DATA_ERROR_PATTERN = /No data found/i;

export const PAGE_ERROR_KEYWORDS = [
  '500', 'Internal Server Error', 'Unhandled', 'Exception',
  'Something went wrong', 'Error:', 'Traceback',
];

// ============================================================
// Helper：收集頁面錯誤
// 每次呼叫回傳一個獨立的 getErrors()，並在完成後提供 detach() 清除監聽器，
// 防止跨頁面污染（page.on 會累積，不自動移除）
// ============================================================

export function attachErrorCollector(page: Page): {
  getErrors: () => string[];
  isNoData: () => boolean;
  detach: () => void;
} {
  const errors: string[] = [];
  let noData = false;

  const onConsole = (msg) => {
    if (msg.type() === 'log') return;

    const text = msg.text();
    // 1. 查無資料訊號（POST 404 / Failed to load resource 404）→ noData，不推 errors
    if (NO_DATA_PATTERNS.some((re) => re.test(text))) {
      noData = true;
      return;
    }
    // 2. 靜默忽略清單（favicon、gtag、Angular ERROR e ...）
    if (JS_ERROR_IGNORE.some((re) => re.test(text))) return;
    // 3. 其餘視為真實錯誤
    errors.push(`[console.error] ${text}`);

    // if (msg.type() === 'error') {
    // Angular HttpClient 的 No data found 錯誤物件 → 靜默忽略（已由 log 那條處理）
    // if (ANGULAR_NO_DATA_ERROR_PATTERN.test(text)) return;
    // 其他忽略清單
    // if (JS_ERROR_IGNORE.some((re) => re.test(text))) return;
    // errors.push(`[console.error] ${text}`);
  };
  const onPageError = (err) => {
    errors.push(`[pageerror] ${err.message}`);
  };

  const onResponse = (res) => {
    const status = res.status();
    // 只收 5xx；404 為查無資料的正常回應，不計入錯誤
    if (status >= 500 && !HTTP_STATUS_IGNORE.includes(status)) {
      errors.push(`[HTTP ${status}] ${res.url()}`);
    }
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('response', onResponse);

  return {
    getErrors: () => [...errors],
    isNoData: () => noData,
    detach: () => {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('response', onResponse);
    },
  };
};

// ============================================================
// Helper：掃描頁面文字是否含錯誤關鍵字
// ============================================================
export async function assertNoPageErrors(page: Page, collectedErrors: string[]) {
  // 1. JS / 網路錯誤
  expect(
    collectedErrors,
    `發現以下錯誤:\n${collectedErrors.join('\n')}`
  ).toHaveLength(0);

  // 2. 頁面可見文字錯誤關鍵字
  const body = await page.locator('body').innerText().catch(() => '');
  for (const kw of PAGE_ERROR_KEYWORDS) {
    expect(body, `頁面出現錯誤關鍵字: "${kw}"`).not.toContain(kw);
  }
}