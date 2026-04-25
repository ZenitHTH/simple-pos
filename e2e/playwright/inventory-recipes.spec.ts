<<<<<<< Updated upstream
import { test, expect, chromium, Page } from '@playwright/test';
import { performLogin, navigateTo, getMainPage, clickElement, setupTestBrowser } from './helpers';
import { logger } from './logger';
=======
import { test, expect, Page } from '@playwright/test';
import { performLogin, navigateTo, clickElement, setupTestBrowser } from './helpers';
>>>>>>> Stashed changes

test.describe('Priority A - Inventory & Recipes', () => {
  let browser: any;
  let page: Page;
  let isTauri: boolean;

  test.beforeAll(async () => {
<<<<<<< Updated upstream
    logger.info("Initializing test environment...");
    const setup = await setupTestBrowser(chromium);
    browser = setup.browser;
    isTauri = setup.isTauri;

    if (isTauri) {
      page = await getMainPage(browser);
    } else {
      // Fallback mode: launch a standard page and navigate to dev server
      const context = await browser.newContext();
      page = await context.newPage();
      await page.goto('http://127.0.0.1:3000');
    }
    
    await performLogin(page);
    logger.info(`Test environment initialized (Tauri: ${isTauri}).`);
  });

  test.afterAll(async () => {
    if (browser && !isTauri) {
      await browser.close();
    }
=======
    const setup = await setupTestBrowser();
    browser = setup.browser;
    page = setup.page;
    await performLogin(page);
  });

  test.afterAll(async () => {
    if (browser) await browser.close();
>>>>>>> Stashed changes
  });


  test('TEST-A1: Golden Path - Recipe & Inventory Deduction', async () => {
    logger.info("Starting TEST-A1...");

    // 1. Create Material "Coffee Beans"
<<<<<<< Updated upstream
    logger.info("Navigating to Inventory & Stock...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    
    logger.info("Switching to Raw Materials tab...");
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    logger.info("Creating new material: Coffee Beans...");
=======
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
>>>>>>> Stashed changes
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    
    await page.getByTestId('material-name-input').fill('Coffee Beans');
    await page.getByTestId('material-volume-input').fill('1000');
    await page.getByTestId('material-quantity-input').fill('1');
    
    await clickElement(page, page.getByTestId('material-type-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Gram', { exact: true }));
    
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    await expect(page.locator('table')).toContainText('Coffee Beans', { timeout: 10000 });
<<<<<<< Updated upstream
    logger.info("Material 'Coffee Beans' created.");
=======
>>>>>>> Stashed changes

    // 2. Create Product "Double Espresso"
    await navigateTo(page, 'Management', 'Product Management');
<<<<<<< Updated upstream
    logger.info("Creating new product: Double Espresso...");
=======
>>>>>>> Stashed changes
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    
    await page.getByTestId('product-title-input').fill('Double Espresso');
    await clickElement(page, page.getByTestId('product-category-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Coffee', { exact: true }));
    await page.getByTestId('product-price-input').fill('5000');
    
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    await expect(page.locator('table')).toContainText('Double Espresso', { timeout: 10000 });
<<<<<<< Updated upstream
    logger.info("Product 'Double Espresso' created.");
=======
>>>>>>> Stashed changes

    // 3. Link in Recipe Builder
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
<<<<<<< Updated upstream
    
    logger.info("Navigating to Recipe Builder...");
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
    // Select "Double Espresso" in the right pane (Product Selection)
    logger.info("Selecting Double Espresso in Recipe Builder...");
=======
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
>>>>>>> Stashed changes
    await page.locator('input[placeholder*="Search products"]').fill('Double Espresso');
    // Use data-testid for product selection
    await clickElement(page, page.locator('button[data-testid^="product-select-"]').first());
    
<<<<<<< Updated upstream
    // Add "Coffee Beans" from left pane
    logger.info("Adding Coffee Beans to recipe...");
=======
>>>>>>> Stashed changes
    await page.locator('input[placeholder*="Search materials"]').fill('Coffee Beans');
    // Use data-testid for adding material
    await clickElement(page, page.locator('button[data-testid^="add-material-btn-"]').first());
    
<<<<<<< Updated upstream
    // Set volume to 18g
    logger.info("Setting recipe volume to 18g...");
    const volumeInput = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).locator('input[type="number"]');
    await volumeInput.fill('18');
    
    logger.info("Saving recipe...");
=======
    // BREAKOUT LOOP: Wait for volume input to appear with explicit retries
    console.log("Waiting for volume input to appear...");
    let volumeInput = page.locator('input[id^="recipe-item-volume-"]').first();
    let retryCount = 0;
    const maxRetries = 10;
    
    while (retryCount < maxRetries) {
      if (await volumeInput.isVisible()) {
        console.log("Volume input visible, filling...");
        await volumeInput.fill('18');
        break;
      }
      console.log(`Waiting for volume input... retry ${retryCount + 1}/${maxRetries}`);
      await page.waitForTimeout(1000);
      retryCount++;
    }
    
    if (retryCount === maxRetries) {
      throw new Error("Stuck: Volume input never appeared after adding material.");
    }
    
>>>>>>> Stashed changes
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });
<<<<<<< Updated upstream
    logger.info("Recipe saved.");

    // 4. Perform Sale
    logger.info("Performing sale in POS...");
=======

    // 4. Perform Sale
>>>>>>> Stashed changes
    await navigateTo(page, null, 'Main Page');
    await clickElement(page, page.locator('.tuner-card').filter({ hasText: 'Double Espresso' }));
    await clickElement(page, page.getByRole('button', { name: /CHECKOUT NOW/i }));
    // Select quick amount to make payment valid
    await clickElement(page, page.getByRole('button', { name: /฿100.00/i }).first());
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
<<<<<<< Updated upstream
    
    // Wait for payment to complete
    await expect(page.getByText(/Your cart is empty|Cart is Empty/i)).toBeVisible({ timeout: 10000 });
    logger.info("Sale completed.");

    // 5. Verify Stock
    logger.info("Verifying stock deduction...");
=======
    await expect(page.getByText(/Payment Successful/i)).toBeVisible({ timeout: 10000 });

    // 5. Verify stock deduction
>>>>>>> Stashed changes
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    const coffeeBeansRow = page.locator('tr').filter({ hasText: 'Coffee Beans' });
    await expect(coffeeBeansRow).toContainText('982', { timeout: 10000 });
<<<<<<< Updated upstream
    logger.info("TEST-A1 Passed: Stock is 982.");
=======
>>>>>>> Stashed changes
  });

  test('TEST-A2: Decimal Precision - 0.5 unit recipe', async () => {
    logger.info("Starting TEST-A2...");

    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
<<<<<<< Updated upstream
    
    logger.info("Creating new material: Milk...");
=======
>>>>>>> Stashed changes
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    
    await page.getByTestId('material-name-input').fill('Milk');
    await page.getByTestId('material-volume-input').fill('10');
    await page.getByTestId('material-quantity-input').fill('1');
    
    await clickElement(page, page.getByTestId('material-type-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Liters', { exact: true }));
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    
    await navigateTo(page, 'Management', 'Product Management');
<<<<<<< Updated upstream
    logger.info("Creating new product: Small Latte...");
=======
>>>>>>> Stashed changes
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.getByTestId('product-title-input').fill('Small Latte');
    await clickElement(page, page.getByTestId('product-category-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Coffee', { exact: true }));
    await page.getByTestId('product-price-input').fill('4000');
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));

    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
<<<<<<< Updated upstream
    logger.info("Setting recipe for Small Latte (0.5L Milk)...");
=======
>>>>>>> Stashed changes
    await page.locator('input[placeholder*="Search products"]').fill('Small Latte');
    await clickElement(page, page.locator('button[data-testid^="product-select-"]').first());
    
    await page.locator('input[placeholder*="Search materials"]').fill('Milk');
    await clickElement(page, page.locator('button[data-testid^="add-material-btn-"]').first());
    
    // BREAKOUT LOOP
    console.log("Waiting for volume input to appear...");
    let volumeInput = page.locator('input[id^="recipe-item-volume-"]').first();
    let retryCount = 0;
    const maxRetries = 10;
    
    while (retryCount < maxRetries) {
      if (await volumeInput.isVisible()) {
        console.log("Volume input visible, filling...");
        await volumeInput.fill('0.5');
        break;
      }
      console.log(`Waiting for volume input... retry ${retryCount + 1}/${maxRetries}`);
      await page.waitForTimeout(1000);
      retryCount++;
    }
    
    if (retryCount === maxRetries) {
      throw new Error("Stuck: Volume input never appeared after adding material.");
    }
    
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });

<<<<<<< Updated upstream
    // 4. Perform 3 Sales
    logger.info("Performing 3 sales of Small Latte...");
=======
>>>>>>> Stashed changes
    await navigateTo(page, null, 'Main Page');
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Small Latte' });
    
    for (let i = 0; i < 3; i++) {
<<<<<<< Updated upstream
      logger.info(`Sale ${i + 1}/3...`);
=======
>>>>>>> Stashed changes
      await clickElement(page, productCard);
    }
    
    await clickElement(page, page.getByRole('button', { name: /CHECKOUT NOW/i }));
    // Select quick amount to make payment valid
    await clickElement(page, page.getByRole('button', { name: /฿100.00/i }).first());
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
    await expect(page.getByText(/Payment Successful/i)).toBeVisible({ timeout: 10000 });

<<<<<<< Updated upstream
    // 5. Verify Stock: 10 - (0.5 * 3) = 8.5
    logger.info("Verifying stock deduction (10 - 1.5 = 8.5)...");
=======
>>>>>>> Stashed changes
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    const milkRow = page.locator('tr').filter({ hasText: 'Milk' });
    await expect(milkRow).toContainText('8.5', { timeout: 10000 });
<<<<<<< Updated upstream
    logger.info("TEST-A2 Passed: Stock is 8.5.");
=======
>>>>>>> Stashed changes
  });
});

