# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibe-pos.spec.ts >> Vibe POS Comprehensive E2E >> Step 1: Verify Application Launch
- Location: e2e/playwright/vibe-pos.spec.ts:31:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium, Page } from '@playwright/test';
  2   | import { performLogin, navigateTo, setInputValue, getMainPage, clickElement } from './helpers';
  3   | 
  4   | test.describe('Vibe POS Comprehensive E2E', () => {
  5   |   let browser: any;
  6   |   let page: Page;
  7   | 
  8   |   test.beforeAll(async () => {
  9   |     console.log("Connecting to Tauri via CDP...");
  10  |     try {
> 11  |       browser = await chromium.connectOverCDP('http://127.0.0.1:9223', { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: socket hang up
  12  |       page = await getMainPage(browser);
  13  |       console.log("Connected! Starting initial setup/login...");
  14  |       
  15  |       // Perform initial setup/login
  16  |       await performLogin(page);
  17  |       console.log("Initial setup/login complete.");
  18  |     } catch (err) {
  19  |       console.error("Failed to initialize test context:", err);
  20  |       throw err;
  21  |     }
  22  |   });
  23  | 
  24  |   test.afterAll(async () => {
  25  |     if (browser) {
  26  |       console.log("Cleaning up browser connection...");
  27  |       // We don't close the browser here to let the runner handle process termination
  28  |     }
  29  |   });
  30  | 
  31  |   test('Step 1: Verify Application Launch', async () => {
  32  |     console.log("Verifying app title...");
  33  |     await expect(page).toHaveTitle('Simple POS', { timeout: 10000 });
  34  |   });
  35  | 
  36  |   test('Step 2: Full POS Workflow (Category -> Product -> Sale)', async () => {
  37  |     console.log("Starting POS Workflow...");
  38  | 
  39  |     // 1. Create Category
  40  |     console.log("Navigating to Categories...");
  41  |     await navigateTo(page, 'Management', 'Categories');
  42  |     
  43  |     console.log("Creating new category...");
  44  |     await clickElement(page, page.getByRole('button', { name: /New Category/i }));
  45  |     await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
  46  |     await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
  47  |     
  48  |     // Verify category exists in table
  49  |     await expect(page.locator('table')).toContainText('Beverages', { timeout: 10000 });
  50  |     console.log("Category created successfully.");
  51  | 
  52  |     // 2. Create Product
  53  |     console.log("Navigating to Product Management...");
  54  |     await navigateTo(page, 'Management', 'Product Management');
  55  |     
  56  |     console.log("Creating new product...");
  57  |     await clickElement(page, page.getByRole('button', { name: /New Product/i }));
  58  |     
  59  |     // Wait for modal transition
  60  |     await page.waitForTimeout(1000);
  61  |     
  62  |     console.log("Entering product details...");
  63  |     await page.getByLabel('Title').fill('Espresso');
  64  |     
  65  |     // Select Category (Custom Select component)
  66  |     console.log("Selecting category...");
  67  |     // Find the select trigger next to the Category label
  68  |     const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
  69  |     await clickElement(page, categoryTrigger);
  70  |     
  71  |     // Wait for popover and select "Beverages"
  72  |     console.log("Waiting for Beverages option...");
  73  |     const option = page.locator('div.bg-popover').getByText('Beverages', { exact: true });
  74  |     await clickElement(page, option);
  75  |     
  76  |     // Set Price (Satang) - 5000 satang = 50.00
  77  |     console.log("Setting price...");
  78  |     await page.getByLabel('Price (Satang)').fill('5000');
  79  |     
  80  |     console.log("Saving product...");
  81  |     await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
  82  |     
  83  |     // Verify product exists in table
  84  |     await expect(page.locator('table')).toContainText('Espresso', { timeout: 15000 });
  85  |     console.log("Product created successfully.");
  86  | 
  87  |     // 3. Complete Sale in POS
  88  |     console.log("Navigating to Main Page...");
  89  |     await navigateTo(page, null, 'Main Page');
  90  |     
  91  |     // Wait for the grid to be visible and stable
  92  |     console.log("Waiting for product grid...");
  93  |     const grid = page.locator('.grid.relative');
  94  |     await grid.waitFor({ state: 'visible', timeout: 20000 });
  95  | 
  96  |     // Find and click the Espresso product card
  97  |     const productCard = page.locator('.tuner-card').filter({ hasText: 'Espresso' });
  98  |     await productCard.waitFor({ state: 'visible', timeout: 20000 });
  99  |     console.log("Adding Espresso to cart...");
  100 |     await clickElement(page, productCard);
  101 |     
  102 |     // Verify it's in the cart
  103 |     // The cart container is a Card with "Current Order" in the header
  104 |     const cart = page.locator('div.bg-card').filter({ hasText: 'Current Order' }).first();
  105 |     await expect(cart).toContainText('Espresso', { timeout: 10000 });
  106 |     
  107 |     // Click Checkout/Charge
  108 |     console.log("Checking out...");
  109 |     await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
  110 |     
  111 |     // Payment Modal
```