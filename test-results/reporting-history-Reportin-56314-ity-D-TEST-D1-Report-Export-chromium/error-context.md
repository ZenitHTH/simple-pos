# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reporting-history.spec.ts >> Reporting & History (Priority D) >> TEST-D1: Report Export
- Location: e2e/playwright/reporting-history.spec.ts:28:7

# Error details

```
Error: browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9223
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1  | import { test, expect, chromium } from '@playwright/test';
  2  | import { performLogin, navigateTo, getMainPage, clickElement, setInputValue, getCDPUrl } from './helpers';
  3  | import { logger } from './logger';
  4  | 
  5  | /**
  6  |  * Priority D: Reporting & History
  7  |  * This suite covers TEST-D1 (Report Export) and TEST-D2 (Receipt Search).
  8  |  */
  9  | test.describe('Reporting & History (Priority D)', () => {
  10 |   let browser: any;
  11 |   let page: any;
  12 | 
  13 |   test.beforeAll(async () => {
  14 |     logger.info("Connecting to Tauri via CDP...");
  15 |     try {
  16 |       const cdpUrl = await getCDPUrl('http://127.0.0.1:9223');
> 17 |       browser = await chromium.connectOverCDP(cdpUrl, { timeout: 30000 });
     |                                ^ Error: browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9223
  18 |       page = await getMainPage(browser);
  19 |       await performLogin(page);
  20 |       logger.info("Connected and logged in.");
  21 |     } catch (err) {
  22 |       logger.error("Failed to initialize test context:", err);
  23 |       throw err;
  24 |     }
  25 |   });
  26 | 
  27 | 
  28 |   test('TEST-D1: Report Export', async () => {
  29 |     logger.info("Starting TEST-D1: Report Export...");
  30 |     // Navigate to the Export Settings page
  31 |     // Note: Research showed that Export UI is located in /setting/export
  32 |     await navigateTo(page, "System Setting", "Export");
  33 |     
  34 |     // Verify we are on the correct page
  35 |     await expect(page.locator('h1')).toContainText(/Export Data/i);
  36 |     
  37 |     // Select 'CSV' format (default) and trigger export
  38 |     // The actual button text in the component is "Export as CSV" or similar
  39 |     const exportBtn = page.getByRole('button', { name: /Export/i }).first();
  40 |     await expect(exportBtn).toBeVisible();
  41 |     
  42 |     // Click export.
  43 |     logger.info("Clicking export button...");
  44 |     await clickElement(page, exportBtn);
  45 |     
  46 |     // Verify success state (the app uses Toast/AlertContext)
  47 |     // We look for a success indicator or toast
  48 |     logger.info("Waiting for export success message...");
  49 |     await expect(page.getByText(/Exported|Successful|Ready/i)).toBeVisible({ timeout: 15000 });
  50 |     logger.info("Export completed successfully.");
  51 |   });
  52 | 
  53 |   test('TEST-D2: Search for past receipt by ID', async () => {
  54 |     logger.info("Starting TEST-D2: Search for past receipt by ID...");
  55 |     // Return to Main POS page
  56 |     await navigateTo(page, null, "Main Page");
  57 |     
  58 |     // Open History modal/page
  59 |     const historyBtn = page.getByRole('button', { name: /History/i });
  60 |     logger.info("Opening History view...");
  61 |     await clickElement(page, historyBtn);
  62 |     
  63 |     // Verify header in history view
  64 |     await expect(page.locator('h1, h2')).toContainText(/History/i);
  65 |     
  66 |     // Perform a search by ID
  67 |     // In mockup/new DB, we might need to create a sale first or use a known ID
  68 |     const searchInput = page.getByPlaceholder(/Search by ID/i);
  69 |     if (await searchInput.isVisible()) {
  70 |         logger.info("Searching for receipt ID 1001...");
  71 |         await setInputValue(page, 'input[placeholder*="Search by ID"]', '1001');
  72 |         const searchBtn = page.locator('button').filter({ hasText: /Search/i });
  73 |         await clickElement(page, searchBtn);
  74 |         
  75 |         // Verify that the Receipt Detail modal opens or list filters
  76 |         // If it's the modal:
  77 |         const modalHeader = page.locator('h2').filter({ hasText: /Receipt/i });
  78 |         await expect(modalHeader).toBeVisible();
  79 |         
  80 |         logger.info("Receipt detail visible, closing...");
  81 |         const closeBtn = page.getByRole('button', { name: /Close/i });
  82 |         await clickElement(page, closeBtn);
  83 |     } else {
  84 |       logger.info("Search input not visible, skipping search part of TEST-D2");
  85 |     }
  86 |     logger.info("TEST-D2 completed.");
  87 |   });
  88 | });
  89 | 
```