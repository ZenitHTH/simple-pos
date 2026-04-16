# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory-recipes.spec.ts >> Priority A - Inventory & Recipes >> TEST-A1: Golden Path - Recipe & Inventory Deduction
- Location: e2e/playwright/inventory-recipes.spec.ts:23:7

# Error details

```
Error: browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9223
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium, Page } from '@playwright/test';
  2   | import { performLogin, navigateTo, clickElement, getMainPage, getCDPUrl } from './helpers';
  3   | import { logger } from './logger';
  4   | 
  5   | test.describe('Priority A - Inventory & Recipes', () => {
  6   |   let browser: any;
  7   |   let page: Page;
  8   | 
  9   |   test.beforeAll(async () => {
  10  |     logger.info("Connecting to Tauri via CDP...");
  11  |     try {
  12  |       const cdpUrl = await getCDPUrl('http://127.0.0.1:9223');
> 13  |       browser = await chromium.connectOverCDP(cdpUrl, { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9223
  14  |       page = await getMainPage(browser);
  15  |       await performLogin(page);
  16  |     } catch (err) {
  17  |       logger.error("Failed to initialize test context:", err);
  18  |       throw err;
  19  |     }
  20  |   });
  21  | 
  22  | 
  23  |   test('TEST-A1: Golden Path - Recipe & Inventory Deduction', async () => {
  24  |     logger.info("Starting TEST-A1...");
  25  | 
  26  |     // 1. Create Material "Coffee Beans"
  27  |     logger.info("Navigating to Inventory & Stock...");
  28  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  29  |     
  30  |     logger.info("Switching to Raw Materials tab...");
  31  |     await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
  32  |     
  33  |     logger.info("Creating new material: Coffee Beans...");
  34  |     await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
  35  |     
  36  |     await page.getByLabel('Material Name').fill('Coffee Beans');
  37  |     await page.getByLabel('Volume').fill('1000');
  38  |     await page.getByLabel('Quantity').fill('1');
  39  |     
  40  |     // Select Type: Weight (g)
  41  |     const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
  42  |     await clickElement(page, typeTrigger);
  43  |     await clickElement(page, page.locator('div.bg-popover').getByText('Weight (g)', { exact: true }));
  44  |     
  45  |     await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
  46  |     
  47  |     // Verify material exists
  48  |     await expect(page.locator('table')).toContainText('Coffee Beans', { timeout: 10000 });
  49  |     logger.info("Material 'Coffee Beans' created.");
  50  | 
  51  |     // 2. Create Product "Double Espresso"
  52  |     // First we need a category if it doesn't exist (from previous tests it might, but let's be safe)
  53  |     await navigateTo(page, 'Management', 'Categories');
  54  |     if (!(await page.locator('table').getByText('Beverages').isVisible())) {
  55  |       await clickElement(page, page.getByRole('button', { name: /New Category/i }));
  56  |       await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
  57  |       await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
  58  |     }
  59  | 
  60  |     await navigateTo(page, 'Management', 'Product Management');
  61  |     logger.info("Creating new product: Double Espresso...");
  62  |     await clickElement(page, page.getByRole('button', { name: /New Product/i }));
  63  |     
  64  |     await page.getByLabel('Title').fill('Double Espresso');
  65  |     
  66  |     // Select Category
  67  |     const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
  68  |     await clickElement(page, categoryTrigger);
  69  |     await clickElement(page, page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
  70  |     
  71  |     // Set Price: 50.00 = 5000 satang
  72  |     await page.getByLabel('Price (Satang)').fill('5000');
  73  |     
  74  |     await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
  75  |     await expect(page.locator('table')).toContainText('Double Espresso', { timeout: 10000 });
  76  |     logger.info("Product 'Double Espresso' created.");
  77  | 
  78  |     // 3. Link in Recipe Builder
  79  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  80  |     await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
  81  |     
  82  |     logger.info("Navigating to Recipe Builder...");
  83  |     await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
  84  |     
  85  |     // Select "Double Espresso" in the right pane (Product Selection)
  86  |     logger.info("Selecting Double Espresso in Recipe Builder...");
  87  |     await page.locator('input[placeholder*="Search products"]').fill('Double Espresso');
  88  |     const productItem = page.locator('div.bg-card').filter({ hasText: 'Double Espresso' }).first();
  89  |     await clickElement(page, productItem);
  90  |     
  91  |     // Add "Coffee Beans" from left pane
  92  |     logger.info("Adding Coffee Beans to recipe...");
  93  |     await page.locator('input[placeholder*="Search materials"]').fill('Coffee Beans');
  94  |     const materialAddBtn = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).getByRole('button').first();
  95  |     await clickElement(page, materialAddBtn);
  96  |     
  97  |     // Set volume to 18g
  98  |     logger.info("Setting recipe volume to 18g...");
  99  |     const volumeInput = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).locator('input[type="number"]');
  100 |     await volumeInput.fill('18');
  101 |     
  102 |     logger.info("Saving recipe...");
  103 |     await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
  104 |     
  105 |     // Wait for success message
  106 |     await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });
  107 |     logger.info("Recipe saved.");
  108 | 
  109 |     // 4. Perform Sale
  110 |     logger.info("Performing sale in POS...");
  111 |     await navigateTo(page, null, 'Main Page');
  112 |     
  113 |     const productCard = page.locator('.tuner-card').filter({ hasText: 'Double Espresso' });
```