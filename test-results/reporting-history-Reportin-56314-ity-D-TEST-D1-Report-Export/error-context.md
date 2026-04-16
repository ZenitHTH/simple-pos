# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reporting-history.spec.ts >> Reporting & History (Priority D) >> TEST-D1: Report Export
- Location: e2e/playwright/reporting-history.spec.ts:18:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1  | import { test, expect, chromium } from '@playwright/test';
  2  | import { performLogin, navigateTo, getMainPage, clickElement, setInputValue } from './helpers';
  3  | 
  4  | /**
  5  |  * Priority D: Reporting & History
  6  |  * This suite covers TEST-D1 (Report Export) and TEST-D2 (Receipt Search).
  7  |  */
  8  | test.describe('Reporting & History (Priority D)', () => {
  9  |   let browser: any;
  10 |   let page: any;
  11 | 
  12 |   test.beforeAll(async () => {
> 13 |     browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
     |                              ^ Error: browserType.connectOverCDP: socket hang up
  14 |     page = await getMainPage(browser);
  15 |     await performLogin(page);
  16 |   });
  17 | 
  18 |   test('TEST-D1: Report Export', async () => {
  19 |     // Navigate to the Export Settings page
  20 |     // Note: Research showed that Export UI is located in /setting/export
  21 |     await navigateTo(page, "System Setting", "Export");
  22 |     
  23 |     // Verify we are on the correct page
  24 |     await expect(page.locator('h1')).toContainText(/Export Data/i);
  25 |     
  26 |     // Select 'CSV' format (default) and trigger export
  27 |     // The actual button text in the component is "Export as CSV" or similar
  28 |     const exportBtn = page.getByRole('button', { name: /Export/i }).first();
  29 |     await expect(exportBtn).toBeVisible();
  30 |     
  31 |     // Click export.
  32 |     await clickElement(page, exportBtn);
  33 |     
  34 |     // Verify success state (the app uses Toast/AlertContext)
  35 |     // We look for a success indicator or toast
  36 |     await expect(page.getByText(/Exported|Successful|Ready/i)).toBeVisible({ timeout: 15000 });
  37 |   });
  38 | 
  39 |   test('TEST-D2: Search for past receipt by ID', async () => {
  40 |     // Return to Main POS page
  41 |     await navigateTo(page, null, "Main Page");
  42 |     
  43 |     // Open History modal/page
  44 |     const historyBtn = page.getByRole('button', { name: /History/i });
  45 |     await clickElement(page, historyBtn);
  46 |     
  47 |     // Verify header in history view
  48 |     await expect(page.locator('h1, h2')).toContainText(/History/i);
  49 |     
  50 |     // Perform a search by ID
  51 |     // In mockup/new DB, we might need to create a sale first or use a known ID
  52 |     const searchInput = page.getByPlaceholder(/Search by ID/i);
  53 |     if (await searchInput.isVisible()) {
  54 |         await setInputValue(page, 'input[placeholder*="Search by ID"]', '1001');
  55 |         const searchBtn = page.locator('button').filter({ hasText: /Search/i });
  56 |         await clickElement(page, searchBtn);
  57 |         
  58 |         // Verify that the Receipt Detail modal opens or list filters
  59 |         // If it's the modal:
  60 |         const modalHeader = page.locator('h2').filter({ hasText: /Receipt/i });
  61 |         await expect(modalHeader).toBeVisible();
  62 |         
  63 |         const closeBtn = page.getByRole('button', { name: /Close/i });
  64 |         await clickElement(page, closeBtn);
  65 |     }
  66 |   });
  67 | });
  68 | 
```