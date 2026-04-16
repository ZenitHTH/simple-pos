# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibe-pos.spec.ts >> Vibe POS Comprehensive E2E >> Step 1: Verify Application Launch
- Location: e2e/playwright/vibe-pos.spec.ts:33:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://localhost:9223

```

# Test source

```ts
  1   | import { test, expect, chromium, Page } from '@playwright/test';
  2   | import { logger } from './logger';
  3   | import { performLogin, navigateTo, setInputValue, getMainPage, clickElement, getCDPUrl } from './helpers';
  4   | 
  5   | test.describe('Vibe POS Comprehensive E2E', () => {
  6   |   let browser: any;
  7   |   let page: Page;
  8   | 
  9   |   test.beforeAll(async () => {
  10  |     logger.info("Connecting to Tauri via CDP...");
  11  |     try {
  12  |       const cdpUrl = await getCDPUrl('http://localhost:9223');
> 13  |       browser = await chromium.connectOverCDP(cdpUrl, { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: socket hang up
  14  |       page = await getMainPage(browser);
  15  |       logger.info("Connected! Starting initial setup/login...");
  16  |       
  17  |       // Perform initial setup/login
  18  |       await performLogin(page);
  19  |       logger.info("Initial setup/login complete.");
  20  |     } catch (err) {
  21  |       logger.error("Failed to initialize test context:", err);
  22  |       throw err;
  23  |     }
  24  |   });
  25  | 
  26  |   test.afterAll(async () => {
  27  |     if (browser) {
  28  |       logger.info("Cleaning up browser connection...");
  29  |       // We don't close the browser here to let the runner handle process termination
  30  |     }
  31  |   });
  32  | 
  33  |   test('Step 1: Verify Application Launch', async () => {
  34  |     logger.info("Verifying app title...");
  35  |     await expect(page).toHaveTitle('Simple POS', { timeout: 10000 });
  36  |   });
  37  | 
  38  |   test('Step 2: Full POS Workflow (Category -> Product -> Sale)', async () => {
  39  |     logger.info("Starting POS Workflow...");
  40  | 
  41  |     // 1. Create Category
  42  |     logger.info("Navigating to Categories...");
  43  |     await navigateTo(page, 'Management', 'Categories');
  44  |     
  45  |     logger.info("Creating new category...");
  46  |     await clickElement(page, page.getByRole('button', { name: /New Category/i }));
  47  |     await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
  48  |     await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
  49  |     
  50  |     // Verify category exists in table
  51  |     await expect(page.locator('table')).toContainText('Beverages', { timeout: 10000 });
  52  |     logger.info("Category created successfully.");
  53  | 
  54  |     // 2. Create Product
  55  |     logger.info("Navigating to Product Management...");
  56  |     await navigateTo(page, 'Management', 'Product Management');
  57  |     
  58  |     logger.info("Creating new product...");
  59  |     await clickElement(page, page.getByRole('button', { name: /New Product/i }));
  60  |     
  61  |     // Wait for modal transition
  62  |     await page.waitForTimeout(1000);
  63  |     
  64  |     logger.info("Entering product details...");
  65  |     await page.getByLabel('Title').fill('Espresso');
  66  |     
  67  |     // Select Category (Custom Select component)
  68  |     logger.info("Selecting category...");
  69  |     // Find the select trigger next to the Category label
  70  |     const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
  71  |     await clickElement(page, categoryTrigger);
  72  |     
  73  |     // Wait for popover and select "Beverages"
  74  |     logger.info("Waiting for Beverages option...");
  75  |     const option = page.locator('div.bg-popover').getByText('Beverages', { exact: true });
  76  |     await clickElement(page, option);
  77  |     
  78  |     // Set Price (Satang) - 5000 satang = 50.00
  79  |     logger.info("Setting price...");
  80  |     await page.getByLabel('Price (Satang)').fill('5000');
  81  |     
  82  |     logger.info("Saving product...");
  83  |     await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
  84  |     
  85  |     // Verify product exists in table
  86  |     await expect(page.locator('table')).toContainText('Espresso', { timeout: 15000 });
  87  |     logger.info("Product created successfully.");
  88  | 
  89  |     // 3. Complete Sale in POS
  90  |     logger.info("Navigating to Main Page...");
  91  |     await navigateTo(page, null, 'Main Page');
  92  |     
  93  |     // Wait for the grid to be visible and stable
  94  |     logger.info("Waiting for product grid...");
  95  |     const grid = page.locator('.grid.relative');
  96  |     await grid.waitFor({ state: 'visible', timeout: 20000 });
  97  | 
  98  |     // Find and click the Espresso product card
  99  |     const productCard = page.locator('.tuner-card').filter({ hasText: 'Espresso' });
  100 |     await productCard.waitFor({ state: 'visible', timeout: 20000 });
  101 |     logger.info("Adding Espresso to cart...");
  102 |     await clickElement(page, productCard);
  103 |     
  104 |     // Verify it's in the cart
  105 |     // The cart container is a Card with "Current Order" in the header
  106 |     const cart = page.locator('div.bg-card').filter({ hasText: 'Current Order' }).first();
  107 |     await expect(cart).toContainText('Espresso', { timeout: 10000 });
  108 |     
  109 |     // Click Checkout/Charge
  110 |     logger.info("Checking out...");
  111 |     await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
  112 |     
  113 |     // Payment Modal
```