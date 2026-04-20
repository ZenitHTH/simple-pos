import { test, expect, chromium, Page } from '@playwright/test';
import { logger } from './logger';
import { performLogin, navigateTo, setInputValue, getMainPage, clickElement, setupTestBrowser } from './helpers';

test.describe('Vibe POS Comprehensive E2E', () => {
  let browser: any;
  let page: Page;
  let isTauri: boolean;

  test.beforeAll(async () => {
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
    if (browser) {
      logger.info("Cleaning up browser connection...");
      if (!isTauri) {
        await browser.close();
      }
    }
  });

  test('Full POS Golden Path (Setup -> Category -> Product -> Sale -> Alert)', async () => {
    // Step 1: Verify Application Launch
    logger.info("Verifying app title...");
    await expect(page).toHaveTitle('Simple POS', { timeout: 10000 });

    // Step 2: Full POS Workflow (Category -> Product -> Sale)
    logger.info("Starting POS Workflow...");

    // 1. Create Category
    logger.info("Navigating to Categories...");
    await navigateTo(page, 'Management', 'Categories');
    
    logger.info("Creating new category...");
    await clickElement(page, page.getByRole('button', { name: /New Category/i }));
    await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
    await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
    
    // Verify category exists in table
    await expect(page.locator('table')).toContainText('Beverages', { timeout: 10000 });
    logger.info("Category created successfully.");

    // 2. Create Product
    logger.info("Navigating to Product Management...");
    await navigateTo(page, 'Management', 'Product Management');
    
    logger.info("Creating new product...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    
    // Wait for modal transition
    await page.waitForTimeout(1000);
    
    logger.info("Entering product details...");
    await page.getByLabel('Title').fill('Espresso');
    
    // Select Category (Custom Select component)
    logger.info("Selecting category...");
    // Find the select trigger next to the Category label
    const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
    await clickElement(page, categoryTrigger);
    
    // Wait for popover and select "Beverages"
    logger.info("Waiting for Beverages option...");
    const option = page.locator('div.bg-popover').getByText('Beverages', { exact: true });
    await clickElement(page, option);
    
    // Set Price (Satang) - 5000 satang = 50.00
    logger.info("Setting price...");
    await page.getByLabel('Price (Satang)').fill('5000');
    
    logger.info("Saving product...");
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    
    // Verify product exists in table
    await expect(page.locator('table')).toContainText('Espresso', { timeout: 15000 });
    logger.info("Product created successfully.");

    // 3. Complete Sale in POS
    logger.info("Navigating to Main Page...");
    await navigateTo(page, null, 'Main Page');
    
    // Wait for the grid to be visible and stable
    logger.info("Waiting for product grid...");
    const grid = page.locator('.grid.relative');
    await grid.waitFor({ state: 'visible', timeout: 20000 });

    // Find and click the Espresso product card
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Espresso' });
    await productCard.waitFor({ state: 'visible', timeout: 20000 });
    logger.info("Adding Espresso to cart...");
    await clickElement(page, productCard);
    
    // Verify it's in the cart
    const cart = page.locator('div.bg-card').filter({ hasText: 'Current Order' }).first();
    await expect(cart).toContainText('Espresso', { timeout: 10000 });
    
    // Click Checkout/Charge
    logger.info("Checking out...");
    await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
    
    // Payment Modal
    logger.info("Waiting for Payment Modal...");
    const paymentModal = page.locator('div.bg-card').filter({ hasText: 'Cash Payment' }).first();
    await expect(paymentModal).toBeVisible({ timeout: 10000 });
    
    // Click first quick amount button
    logger.info("Selecting quick amount...");
    const quickAmountBtn = page.locator('button.bg-primary\\/10').first();
    await clickElement(page, quickAmountBtn);
    
    // Confirm Payment
    logger.info("Confirming payment...");
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
    
    // Modal should close
    logger.info("Waiting for payment modal to close...");
    await expect(paymentModal).toBeHidden({ timeout: 15000 });
    
    // Cart should be empty
    logger.info("Verifying cart is empty...");
    await expect(page.getByText(/Your cart is empty|Cart is Empty/i)).toBeVisible({ timeout: 10000 });
    logger.info("Sale workflow completed successfully!");

    // Step 3: Verify Duplicate Product Name Alert
    logger.info("Navigating back to Product Management for duplicate check...");
    await navigateTo(page, 'Management', 'Product Management');
    
    logger.info("Attempting to create duplicate product 'Espresso'...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.waitForTimeout(500);
    
    await page.getByLabel('Title').fill('Espresso');
    
    // Select Category
    const categoryTrigger2 = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
    await clickElement(page, categoryTrigger2);
    const option2 = page.locator('div.bg-popover').getByText('Beverages', { exact: true });
    await clickElement(page, option2);
    
    await page.getByLabel('Price (Satang)').fill('1000');
    
    logger.info("Saving duplicate product...");
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    
    // Verify AlertDialog appears
    logger.info("Verifying AlertDialog notification...");
    const alertDialog = page.getByRole('alertdialog');
    await expect(alertDialog).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Product Error/i })).toBeVisible();
    await expect(alertDialog.getByText(/exists/i)).toBeVisible();
    
    // Click OK on AlertDialog
    logger.info("Closing AlertDialog...");
    const okBtn = alertDialog.getByRole('button', { name: /OK/i });
    await clickElement(page, okBtn);
    
    // Verify AlertDialog is hidden
    await expect(alertDialog).toBeHidden({ timeout: 5000 });
    logger.info("Duplicate check completed successfully.");
    
    // Close modal
    await clickElement(page, page.getByRole('button', { name: /Cancel/i }));
  });
});
