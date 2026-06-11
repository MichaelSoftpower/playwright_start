// ============================================================
// 頁面類型定義
// ============================================================

type PageType =
  | 'basic'           // 進頁面即可，無需互動
  | 'search-with-date' // 需選日期 + 點 Search
// | 'search-no-date';  // 只需點 Search（無日期）

interface RouteConfig {
  name: string;
  path: string;
  type: PageType;
  searchButtonText?: string; // 預設 'Search'
  apiPattern?: RegExp;
}

// ============================================================
// 路由清單 — 依需求新增 / 修改
// ============================================================

export const HealthCheck_Routes: RouteConfig[] = [
  // --- 基本頁面（進去沒報錯即通過）---
  { name: 'Create Order', path: '/orders/create', type: 'basic' },
  { name: 'Main Event', path: '/events', type: 'basic', apiPattern: /\/rest/ },
  // { name: 'Find Order', path: '/orders', type: 'basic', apiPattern: /\/rest\/orders\?_branch=search/ },
  // { name: 'Find User', path: '/users', type: 'basic' },
  // { name: 'Find Promo Codes', path: '/promo-codes', type: 'basic' },
  // { name: 'Create Affiliate', path: '/affiliates/create', type: 'basic' },
  { name: 'Affiliate', path: '/affiliates', type: 'basic' },
  // { name: 'Create Channel', path: '/channels/create', type: 'basic' },
  { name: 'Channels', path: '/channels', type: 'basic' },
  // { name: 'Create Order', path: '/orders/create', type: 'basic' },
  // { name: 'Create Customer', path: '/clients/create', type: 'basic' },
  // { name: 'Create User', path: '/users/create', type: 'basic' },
  { name: 'Site Setting', path: '/settings/site/update', type: 'basic' },
  // --- 需要日期 + Search ---

  { name: 'Sales', path: '/reports/sales', type: 'search-with-date' },
  { name: 'Detailed Sales', path: '/reports/detailed-sales', type: 'search-with-date' },
  { name: 'Sold Ticket', path: '/reports/sold-ticket', type: 'search-with-date' },
  // { name: 'Open Ticket', path: '/reports/open-ticket', type: 'search-with-date' },
  // { name: 'Ticket Summary', path: '/reports/ticket-summary', type: 'search-with-date' },
  // { name: 'Tickets Sales', path: '/reports/tickets-sales', type: 'search-with-date' },
  // { name: 'Ticket Quantities', path: '/reports/ticket-quantities', type: 'search-with-date' },
  { name: 'Season Ticket', path: '/reports/season-ticket', type: 'search-with-date' },
  { name: 'Channel Sales by Price code', path: '/finance/channels', type: 'search-with-date' },
  // { name: 'Price Code Totals', path: '/finance/pricing-code-total', type: 'search-with-date' },
  // { name: 'Ticket Category Totals', path: '/finance/ticket-category', type: 'search-with-date' },
  // { name: 'Scan Report', path: '/reports/scan', type: 'search-with-date' },
  // { name: 'Transfer', path: '/reports/ticket-transfer', type: 'search-with-date' },
  { name: 'Hold Report', path: '/reports/ticket-hold', type: 'search-with-date' },
  { name: 'Presale Report', path: '/reports/presale', type: 'search-with-date' },
  { name: 'Item Summary', path: '/reports/item', type: 'search-with-date' },
  { name: 'Item Detail', path: '/reports/item-detail', type: 'search-with-date' },
  // // { name: 'Item Scan Report !', path: '/reports/item-scan', type: 'search-with-date' },
  { name: 'Hospitality Sales', path: '/reports/hospitality-sales', type: 'search-with-date' },
  { name: 'Sold Hospitality', path: '/reports/hospitality-sold', type: 'search-with-date' },
  { name: 'Open Hospitality', path: '/reports/hospitality-open', type: 'search-with-date' },
  { name: 'Hospitality Summary', path: '/reports/hospitality-summary', type: 'search-with-date' },
  { name: 'Item Fulfillment', path: '/reports/item-fulfillment', type: 'search-with-date' },
  // { name: 'Airline Manifest', path: '/reports/airline', type: 'search-with-date' },
  // { name: 'Guest List', path: '/reports/customer-manifest', type: 'search-with-date' },
  // { name: 'Order Manifest', path: '/reports/order-manifest', type: 'search-with-date' },
  { name: 'Rooming List', path: '/reports/rooming', type: 'search-with-date' },
  { name: 'Cashier', path: '/finance/cashier', type: 'search-with-date' },
  { name: 'Fee Report', path: '/reports/fee', type: 'search-with-date' },
  { name: 'Receiving', path: '/reports/receiving', type: 'search-with-date' },
  // { name: 'Affiliate', path: '/reports/partner-affiliate', type: 'search-with-date' },
  // { name: 'Channel Sales by Price Code', path: '/finance/channels', type: 'search-with-date' },
  // { name: 'Create Promo Code', path: '/promo-codes/create', type: 'search-with-date' },
  // { name: 'Promo Code Report', path: '/reports/promo-code', type: 'search-with-date' },


];