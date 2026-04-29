import { test, expect, Page } from '@playwright/test';
import { performLogin, navigateTo, clickElement, setupTestBrowser } from './helpers';
import { logger } from './logger';

test.describe('Priority A - Inventory & Recipes', () => {
  let browser: any;
  let page: Page;

  test.beforeAll(async () => {
    logger.info("Initializing test environment...");
    const setup = await setupTestBrowser(test.info().project.use.browserName as any);
    browser = setup.browser;
    page = await (setup as any).page || await (setup as any).browser.contexts()[0].pages()[0];
    
    await performLogin(page);
    logger.info("Test environment initialized.");
  });

  test.afterAll(async () => {
    if (browser) await browser.close();
  });

  test('TEST-A1: Golden Path - Recipe & Inventory Deduction', async () => {
    logger.info("Starting TEST-A1...");

    // 1. Create Material "Coffee Beans"
    logger.info("Navigating to Inventory & Stock...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    
    logger.info("Switching to Raw Materials tab...");
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    logger.info("Creating new material: Coffee Beans...");
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    
    await page.getByTestId('material-name-input').fill('Coffee Beans');
    await page.getByTestId('material-volume-input').fill('1000');
    await page.getByTestId('material-quantity-input').fill('1');
    
    await clickElement(page, page.getByTestId('material-type-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Gram', { exact: true }));
    
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    await expect(page.locator('table')).toContainText('Coffee Beans', { timeout: 10000 });
    logger.info("Material 'Coffee Beans' created.");

    // 2. Create Product "Double Espresso"
    await navigateTo(page, 'Management', 'Product Management');
    logger.info("Creating new product: Double Espresso...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    
    await page.getByTestId('product-title-input').fill('Double Espresso');
    await clickElement(page, page.getByTestId('product-category-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Coffee', { exact: true }));
    await page.getByTestId('product-price-input').fill('5000');
    
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    await expect(page.locator('table')).toContainText('Double Espresso', { timeout: 10000 });
    logger.info("Product 'Double Espresso' created.");

    // 3. Link in Recipe Builder
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    logger.info("Navigating to Recipe Builder...");
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
    // Select "Double Espresso" in the right pane (Product Selection)
    logger.info("Selecting Double Espresso in Recipe Builder...");
    await page.locator('input[placeholder*="Search products"]').fill('Double Espresso');
    await clickElement(page, page.locator('button[data-testid^="product-select-"]').first());
    
    // Add "Coffee Beans" from left pane
    logger.info("Adding Coffee Beans to recipe...");
    await page.locator('input[placeholder*="Search materials"]').fill('Coffee Beans');
    await clickElement(page, page.locator('button[data-testid^="add-material-btn-"]').first());
    
    // Set volume to 18g
    logger.info("Setting recipe volume to 18g...");
    let volumeInput = page.locator('input[id^="recipe-item-volume-"]').first();
    let retryCount = 0;
    const maxRetries = 10;
    
    while (retryCount < maxRetries) {
      if (await volumeInput.isVisible()) {
        await volumeInput.fill('18');
        break;
      }
      await page.waitForTimeout(1000);
      retryCount++;
    }
    
    logger.info("Saving recipe...");
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });
    logger.info("Recipe saved.");

    // 4. Perform Sale
    logger.info("Performing sale in POS...");
    await navigateTo(page, null, 'Main Page');
    await clickElement(page, page.locator('.tuner-card').filter({ hasText: 'Double Espresso' }));
    await clickElement(page, page.getByRole('button', { name: /CHECKOUT NOW/i }));
    await clickElement(page, page.getByRole('button', { name: /฿100.00/i }).first());
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
    
    await expect(page.getByText(/Payment Successful/i)).toBeVisible({ timeout: 10000 });
    logger.info("Sale completed.");

    // 5. Verify Stock
    logger.info("Verifying stock deduction...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    const coffeeBeansRow = page.locator('tr').filter({ hasText: 'Coffee Beans' });
    await expect(coffeeBeansRow).toContainText('982', { timeout: 10000 });
    logger.info("TEST-A1 Passed: Stock is 982.");
  });

  test('TEST-A2: Decimal Precision - 0.5 unit recipe', async () => {
    logger.info("Starting TEST-A2...");

    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    logger.info("Creating new material: Milk...");
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    
    await page.getByTestId('material-name-input').fill('Milk');
    await page.getByTestId('material-volume-input').fill('10');
    await page.getByTestId('material-quantity-input').fill('1');
    
    await clickElement(page, page.getByTestId('material-type-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Liters', { exact: true }));
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    
    await navigateTo(page, 'Management', 'Product Management');
    logger.info("Creating new product: Small Latte...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.getByTestId('product-title-input').fill('Small Latte');
    await clickElement(page, page.getByTestId('product-category-select'));
    await clickElement(page, page.locator('div.bg-popover').getByText('Coffee', { exact: true }));
    await page.getByTestId('product-price-input').fill('4000');
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));

    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
    logger.info("Setting recipe for Small Latte (0.5L Milk)...");
    await page.locator('input[placeholder*="Search products"]').fill('Small Latte');
    await clickElement(page, page.locator('button[data-testid^="product-select-"]').first());
    
    await page.locator('input[placeholder*="Search materials"]').fill('Milk');
    await clickElement(page, page.locator('button[data-testid^="add-material-btn-"]').first());
    
    let volumeInput = page.locator('input[id^="recipe-item-volume-"]').first();
    let retryCount = 0;
    const maxRetries = 10;
    
    while (retryCount < maxRetries) {
      if (await volumeInput.isVisible()) {
        await volumeInput.fill('0.5');
        break;
      }
      await page.waitForTimeout(1000);
      retryCount++;
    }
    
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });

    logger.info("Performing 3 sales of Small Latte...");
    await navigateTo(page, null, 'Main Page');
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Small Latte' });
    
    for (let i = 0; i < 3; i++) {
      logger.info(`Sale ${i + 1}/3...`);
      await clickElement(page, productCard);
    }
    
    await clickElement(page, page.getByRole('button', { name: /CHECKOUT NOW/i }));
    await clickElement(page, page.getByRole('button', { name: /฿100.00/i }).first());
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
    await expect(page.getByText(/Payment Successful/i)).toBeVisible({ timeout: 10000 });

    logger.info("Verifying stock deduction (10 - 1.5 = 8.5)...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    const milkRow = page.locator('tr').filter({ hasText: 'Milk' });
    await expect(milkRow).toContainText('8.5', { timeout: 10000 });
    logger.info("TEST-A2 Passed: Stock is 8.5.");
  });
});
