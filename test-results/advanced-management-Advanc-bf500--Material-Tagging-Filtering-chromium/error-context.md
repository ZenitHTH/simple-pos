# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced-management.spec.ts >> Advanced Management (Priority C) >> TEST-C1: Material Tagging & Filtering
- Location: e2e/playwright/advanced-management.spec.ts:23:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium } from '@playwright/test';
  2   | import { logger } from './logger';
  3   | import { performLogin, navigateTo, getMainPage, clickElement, getCDPUrl } from './helpers';
  4   | 
  5   | test.describe('Advanced Management (Priority C)', () => {
  6   |   let browser: any;
  7   |   let page: any;
  8   | 
  9   |   test.beforeAll(async () => {
  10  |     logger.info("Connecting to Tauri via CDP...");
  11  |     try {
  12  |       const cdpUrl = await getCDPUrl('http://127.0.0.1:9223');
> 13  |       browser = await chromium.connectOverCDP(cdpUrl, { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: socket hang up
  14  |       page = await getMainPage(browser);
  15  |       await performLogin(page);
  16  |       logger.info("Connected and logged in.");
  17  |     } catch (err) {
  18  |       logger.error("Failed to initialize test context:", err);
  19  |       throw err;
  20  |     }
  21  |   });
  22  | 
  23  |   test('TEST-C1: Material Tagging & Filtering', async () => {
  24  |     logger.info("Starting TEST-C1: Material Tagging & Filtering...");
  25  |     // 1. Navigate to Material Management (Inventory -> Raw Materials tab)
  26  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  27  |     
  28  |     // Switch to Raw Materials tab
  29  |     const materialsTab = page.getByRole('button', { name: /Raw Materials/i });
  30  |     await clickElement(page, materialsTab);
  31  | 
  32  |     // 2. Create Material with Tags
  33  |     logger.info("Creating new material with tags...");
  34  |     await clickElement(page, page.getByRole('button', { name: /New Material/i }));
  35  |     await page.getByLabel('Name').fill('Organic Coffee');
  36  |     await page.getByLabel('Volume').fill('500');
  37  |     await page.getByLabel('Quantity').fill('10');
  38  |     
  39  |     // Select Type/Unit (Custom Select)
  40  |     const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
  41  |     await clickElement(page, typeTrigger);
  42  |     await clickElement(page, page.locator('div.bg-popover').getByText('Ingredient', { exact: true }));
  43  | 
  44  |     // Add Tags
  45  |     const tagInput = page.getByPlaceholder(/Add a tag/i);
  46  |     await tagInput.fill('Organic');
  47  |     await page.keyboard.press('Enter');
  48  |     await tagInput.fill('Dark Roast');
  49  |     await page.keyboard.press('Enter');
  50  | 
  51  |     await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
  52  |     logger.info("Material created.");
  53  | 
  54  |     // 3. Verify Filtering
  55  |     logger.info("Verifying filtering by tag...");
  56  |     // Assuming tags are shown as pill buttons in a filter area
  57  |     const organicTagFilter = page.locator('.pill-group button').filter({ hasText: 'Organic' });
  58  |     await clickElement(page, organicTagFilter);
  59  |     
  60  |     // Table should contain 'Organic Coffee'
  61  |     await expect(page.locator('table')).toContainText('Organic Coffee');
  62  |     
  63  |     // Deselect Organic, select something else (if exists)
  64  |     await clickElement(page, organicTagFilter);
  65  |     logger.info("TEST-C1 completed.");
  66  |   });
  67  | 
  68  |   test('TEST-C3: Customer Management & Protection', async () => {
  69  |     logger.info("Starting TEST-C3: Customer Management & Protection...");
  70  |     // 1. Create Customer
  71  |     await navigateTo(page, 'Management', 'Customers');
  72  |     await clickElement(page, page.getByRole('button', { name: /New Customer/i }));
  73  |     
  74  |     logger.info("Creating customer Alice Tester...");
  75  |     await page.getByLabel(/Name/i).fill('Alice Tester');
  76  |     await page.getByLabel(/Tax ID/i).fill('1234567890123');
  77  |     await clickElement(page, page.getByRole('button', { name: /Save Customer/i }));
  78  |     
  79  |     await expect(page.locator('table')).toContainText('Alice Tester');
  80  | 
  81  |     // 2. Link to Sale
  82  |     logger.info("Linking customer to a new sale...");
  83  |     await navigateTo(page, null, 'Main Page');
  84  |     
  85  |     // Add any product to cart
  86  |     const productCard = page.locator('.tuner-card').first();
  87  |     await clickElement(page, productCard);
  88  |     
  89  |     // Open Customer Selector
  90  |     await clickElement(page, page.getByRole('button', { name: /Add Customer/i }));
  91  |     await page.getByPlaceholder(/Search customers/i).fill('Alice Tester');
  92  |     await clickElement(page, page.getByText('Alice Tester'));
  93  |     
  94  |     // Complete Sale
  95  |     logger.info("Completing sale...");
  96  |     await clickElement(page, page.getByRole('button', { name: /Charge/i }));
  97  |     await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
  98  | 
  99  |     // 3. Verify Deletion Block
  100 |     logger.info("Verifying that customer deletion is blocked due to active receipts...");
  101 |     await navigateTo(page, 'Management', 'Customers');
  102 |     
  103 |     // Click Delete for Alice
  104 |     const aliceRow = page.locator('tr').filter({ hasText: 'Alice Tester' });
  105 |     const deleteBtn = aliceRow.getByRole('button', { name: /Delete/i });
  106 |     await clickElement(page, deleteBtn);
  107 |     
  108 |     // Confirm in modal
  109 |     await clickElement(page, page.getByRole('button', { name: /OK|Confirm|Delete/i }));
  110 | 
  111 |     // Verify error alert shows dependency message
  112 |     const alert = page.getByRole('alertdialog');
  113 |     await expect(alert).toBeVisible();
```