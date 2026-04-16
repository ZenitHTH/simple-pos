# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory-recipes.spec.ts >> Priority A - Inventory & Recipes >> TEST-A1: Golden Path - Recipe & Inventory Deduction
- Location: e2e/playwright/inventory-recipes.spec.ts:20:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium, Page } from '@playwright/test';
  2   | import { performLogin, navigateTo, clickElement, getMainPage } from './helpers';
  3   | 
  4   | test.describe('Priority A - Inventory & Recipes', () => {
  5   |   let browser: any;
  6   |   let page: Page;
  7   | 
  8   |   test.beforeAll(async () => {
  9   |     console.log("Connecting to Tauri via CDP...");
  10  |     try {
> 11  |       browser = await chromium.connectOverCDP('http://127.0.0.1:9223', { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: socket hang up
  12  |       page = await getMainPage(browser);
  13  |       await performLogin(page);
  14  |     } catch (err) {
  15  |       console.error("Failed to initialize test context:", err);
  16  |       throw err;
  17  |     }
  18  |   });
  19  | 
  20  |   test('TEST-A1: Golden Path - Recipe & Inventory Deduction', async () => {
  21  |     console.log("Starting TEST-A1...");
  22  | 
  23  |     // 1. Create Material "Coffee Beans"
  24  |     console.log("Navigating to Inventory & Stock...");
  25  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  26  |     
  27  |     console.log("Switching to Raw Materials tab...");
  28  |     await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
  29  |     
  30  |     console.log("Creating new material: Coffee Beans...");
  31  |     await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
  32  |     
  33  |     await page.getByLabel('Material Name').fill('Coffee Beans');
  34  |     await page.getByLabel('Volume').fill('1000');
  35  |     await page.getByLabel('Quantity').fill('1');
  36  |     
  37  |     // Select Type: Weight (g)
  38  |     const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
  39  |     await clickElement(page, typeTrigger);
  40  |     await clickElement(page, page.locator('div.bg-popover').getByText('Weight (g)', { exact: true }));
  41  |     
  42  |     await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
  43  |     
  44  |     // Verify material exists
  45  |     await expect(page.locator('table')).toContainText('Coffee Beans', { timeout: 10000 });
  46  |     console.log("Material 'Coffee Beans' created.");
  47  | 
  48  |     // 2. Create Product "Double Espresso"
  49  |     // First we need a category if it doesn't exist (from previous tests it might, but let's be safe)
  50  |     await navigateTo(page, 'Management', 'Categories');
  51  |     if (!(await page.locator('table').getByText('Beverages').isVisible())) {
  52  |       await clickElement(page, page.getByRole('button', { name: /New Category/i }));
  53  |       await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
  54  |       await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
  55  |     }
  56  | 
  57  |     await navigateTo(page, 'Management', 'Product Management');
  58  |     console.log("Creating new product: Double Espresso...");
  59  |     await clickElement(page, page.getByRole('button', { name: /New Product/i }));
  60  |     
  61  |     await page.getByLabel('Title').fill('Double Espresso');
  62  |     
  63  |     // Select Category
  64  |     const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
  65  |     await clickElement(page, categoryTrigger);
  66  |     await clickElement(page, page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
  67  |     
  68  |     // Set Price: 50.00 = 5000 satang
  69  |     await page.getByLabel('Price (Satang)').fill('5000');
  70  |     
  71  |     await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
  72  |     await expect(page.locator('table')).toContainText('Double Espresso', { timeout: 10000 });
  73  |     console.log("Product 'Double Espresso' created.");
  74  | 
  75  |     // 3. Link in Recipe Builder
  76  |     await navigateTo(page, 'Management', 'Inventory & Stock');
  77  |     await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
  78  |     
  79  |     console.log("Navigating to Recipe Builder...");
  80  |     await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
  81  |     
  82  |     // Select "Double Espresso" in the right pane (Product Selection)
  83  |     console.log("Selecting Double Espresso in Recipe Builder...");
  84  |     await page.locator('input[placeholder*="Search products"]').fill('Double Espresso');
  85  |     const productItem = page.locator('div.bg-card').filter({ hasText: 'Double Espresso' }).first();
  86  |     await clickElement(page, productItem);
  87  |     
  88  |     // Add "Coffee Beans" from left pane
  89  |     console.log("Adding Coffee Beans to recipe...");
  90  |     await page.locator('input[placeholder*="Search materials"]').fill('Coffee Beans');
  91  |     const materialAddBtn = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).getByRole('button').first();
  92  |     await clickElement(page, materialAddBtn);
  93  |     
  94  |     // Set volume to 18g
  95  |     console.log("Setting recipe volume to 18g...");
  96  |     const volumeInput = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).locator('input[type="number"]');
  97  |     await volumeInput.fill('18');
  98  |     
  99  |     console.log("Saving recipe...");
  100 |     await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
  101 |     
  102 |     // Wait for success message
  103 |     await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });
  104 |     console.log("Recipe saved.");
  105 | 
  106 |     // 4. Perform Sale
  107 |     console.log("Performing sale in POS...");
  108 |     await navigateTo(page, null, 'Main Page');
  109 |     
  110 |     const productCard = page.locator('.tuner-card').filter({ hasText: 'Double Espresso' });
  111 |     await clickElement(page, productCard);
```