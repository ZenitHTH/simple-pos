# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: advanced-management.spec.ts >> Advanced Management (Priority C) >> TEST-C1: Material Tagging & Filtering
- Location: e2e/playwright/advanced-management.spec.ts:35:7

# Error details

```
Error: Channel closed
```

```
Error: locator.fill: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect, chromium, Page } from '@playwright/test';
  2   | import { logger } from './logger';
  3   | import { performLogin, navigateTo, getMainPage, clickElement, setupTestBrowser } from './helpers';
  4   | 
  5   | test.describe('Advanced Management (Priority C)', () => {
  6   |   let browser: any;
  7   |   let page: Page;
  8   |   let isTauri: boolean;
  9   | 
  10  |   test.beforeAll(async () => {
  11  |     logger.info("Initializing test environment...");
  12  |     const setup = await setupTestBrowser(chromium);
  13  |     browser = setup.browser;
  14  |     isTauri = setup.isTauri;
  15  | 
  16  |     if (isTauri) {
  17  |       page = await getMainPage(browser);
  18  |     } else {
  19  |       // Fallback mode: launch a standard page and navigate to dev server
  20  |       const context = await browser.newContext();
  21  |       page = await context.newPage();
  22  |       await page.goto('http://127.0.0.1:3000');
  23  |     }
  24  | 
  25  |     await performLogin(page);
  26  |     logger.info(`Test environment initialized (Tauri: ${isTauri}).`);
  27  |   });
  28  | 
  29  |   test.afterAll(async () => {
  30  |     if (browser && !isTauri) {
  31  |       await browser.close();
  32  |     }
  33  |   });
  34  | 
  35  |   test('TEST-C1: Material Tagging & Filtering', async () => {
  36  |     logger.info("Starting TEST-C1: Material Tagging & Filtering...");
  37  |     // 1. Navigate to Material Management (Inventory -> Raw Materials tab)
  38  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  39  |     
  40  |     // Switch to Raw Materials tab
  41  |     const materialsTab = page.getByRole('button', { name: /Raw Materials/i });
  42  |     await clickElement(page, materialsTab);
  43  | 
  44  |     // 2. Create Material with Tags
  45  |     logger.info("Creating new material with tags...");
  46  |     await clickElement(page, page.getByRole('button', { name: /New Material/i }));
> 47  |     await page.getByLabel('Name').fill('Organic Coffee');
      |                                   ^ Error: locator.fill: Target page, context or browser has been closed
  48  |     await page.getByLabel('Volume').fill('500');
  49  |     await page.getByLabel('Quantity').fill('10');
  50  |     
  51  |     // Select Type/Unit (Custom Select)
  52  |     const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
  53  |     await clickElement(page, typeTrigger);
  54  |     await clickElement(page, page.locator('div.bg-popover').getByText('Ingredient', { exact: true }));
  55  | 
  56  |     // Add Tags
  57  |     const tagInput = page.getByPlaceholder(/Add a tag/i);
  58  |     await tagInput.fill('Organic');
  59  |     await page.keyboard.press('Enter');
  60  |     await tagInput.fill('Dark Roast');
  61  |     await page.keyboard.press('Enter');
  62  | 
  63  |     await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
  64  |     logger.info("Material created.");
  65  | 
  66  |     // 3. Verify Filtering
  67  |     logger.info("Verifying filtering by tag...");
  68  |     // Assuming tags are shown as pill buttons in a filter area
  69  |     const organicTagFilter = page.locator('.pill-group button').filter({ hasText: 'Organic' });
  70  |     await clickElement(page, organicTagFilter);
  71  |     
  72  |     // Table should contain 'Organic Coffee'
  73  |     await expect(page.locator('table')).toContainText('Organic Coffee');
  74  |     
  75  |     // Deselect Organic, select something else (if exists)
  76  |     await clickElement(page, organicTagFilter);
  77  |     logger.info("TEST-C1 completed.");
  78  |   });
  79  | 
  80  |   test('TEST-C3: Customer Management & Protection', async () => {
  81  |     logger.info("Starting TEST-C3: Customer Management & Protection...");
  82  |     // 1. Create Customer
  83  |     await navigateTo(page, 'Management', 'Customers');
  84  |     await clickElement(page, page.getByRole('button', { name: /New Customer/i }));
  85  |     
  86  |     logger.info("Creating customer Alice Tester...");
  87  |     await page.getByLabel(/Name/i).fill('Alice Tester');
  88  |     await page.getByLabel(/Tax ID/i).fill('1234567890123');
  89  |     await clickElement(page, page.getByRole('button', { name: /Save Customer/i }));
  90  |     
  91  |     await expect(page.locator('table')).toContainText('Alice Tester');
  92  | 
  93  |     // 2. Link to Sale
  94  |     logger.info("Linking customer to a new sale...");
  95  |     await navigateTo(page, null, 'Main Page');
  96  |     
  97  |     // Add any product to cart
  98  |     const productCard = page.locator('.tuner-card').first();
  99  |     await clickElement(page, productCard);
  100 |     
  101 |     // Open Customer Selector
  102 |     await clickElement(page, page.getByRole('button', { name: /Add Customer/i }));
  103 |     await page.getByPlaceholder(/Search customers/i).fill('Alice Tester');
  104 |     await clickElement(page, page.getByText('Alice Tester'));
  105 |     
  106 |     // Complete Sale
  107 |     logger.info("Completing sale...");
  108 |     await clickElement(page, page.getByRole('button', { name: /Charge/i }));
  109 |     await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
  110 | 
  111 |     // 3. Verify Deletion Block
  112 |     logger.info("Verifying that customer deletion is blocked due to active receipts...");
  113 |     await navigateTo(page, 'Management', 'Customers');
  114 |     
  115 |     // Click Delete for Alice
  116 |     const aliceRow = page.locator('tr').filter({ hasText: 'Alice Tester' });
  117 |     const deleteBtn = aliceRow.getByRole('button', { name: /Delete/i });
  118 |     await clickElement(page, deleteBtn);
  119 |     
  120 |     // Confirm in modal
  121 |     await clickElement(page, page.getByRole('button', { name: /OK|Confirm|Delete/i }));
  122 | 
  123 |     // Verify error alert shows dependency message
  124 |     const alert = page.getByRole('alertdialog');
  125 |     await expect(alert).toBeVisible();
  126 |     await expect(alert).toContainText(/receipt/i);
  127 |     
  128 |     await clickElement(page, alert.getByRole('button', { name: /OK/i }));
  129 |     logger.info("TEST-C3 completed: Deletion block verified.");
  130 |   });
  131 | });
  132 | 
```