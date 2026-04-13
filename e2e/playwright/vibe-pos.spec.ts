import { test, expect, chromium, Page } from '@playwright/test';
import { performLogin, navigateTo, setInputValue, getMainPage, clickElement } from './helpers';

test.describe('Vibe POS Comprehensive E2E', () => {
  let browser: any;
  let page: Page;

  test.beforeAll(async () => {
    console.log("Connecting to Tauri via CDP...");
    try {
      browser = await chromium.connectOverCDP('http://127.0.0.1:9223', { timeout: 30000 });
      page = await getMainPage(browser);
      console.log("Connected! Starting initial setup/login...");
      
      // Perform initial setup/login
      await performLogin(page);
      console.log("Initial setup/login complete.");
    } catch (err) {
      console.error("Failed to initialize test context:", err);
      throw err;
    }
  });

  test.afterAll(async () => {
    if (browser) {
      console.log("Cleaning up browser connection...");
      // We don't close the browser here to let the runner handle process termination
    }
  });

  test('Step 1: Verify Application Launch', async () => {
    console.log("Verifying app title...");
    await expect(page).toHaveTitle('Simple POS', { timeout: 10000 });
  });

  test('Step 2: Full POS Workflow (Category -> Product -> Sale)', async () => {
    console.log("Starting POS Workflow...");

    // 1. Create Category
    console.log("Navigating to Categories...");
    await navigateTo(page, 'Management', 'Categories');
    
    console.log("Creating new category...");
    await clickElement(page, page.getByRole('button', { name: /New Category/i }));
    await setInputValue(page, 'input[placeholder="e.g., Coffee"]', 'Beverages');
    await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
    
    // Verify category exists in table
    await expect(page.locator('table')).toContainText('Beverages', { timeout: 10000 });
    console.log("Category created successfully.");

    // 2. Create Product
    console.log("Navigating to Product Management...");
    await navigateTo(page, 'Management', 'Product Management');
    
    console.log("Creating new product...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    
    // Wait for modal transition
    await page.waitForTimeout(1000);
    
    console.log("Entering product details...");
    await page.getByLabel('Title').fill('Espresso');
    
    // Select Category (Custom Select component)
    console.log("Selecting category...");
    // The trigger usually has "Select Category" text
    const categoryTrigger = page.locator('button, div').filter({ hasText: /^Select Category$/ }).last();
    await clickElement(page, categoryTrigger);
    
    // Wait for popover and select "Beverages"
    console.log("Waiting for Beverages option...");
    const option = page.getByRole('option', { name: 'Beverages' }).or(page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
    await clickElement(page, option);
    
    // Set Price (Satang) - 5000 satang = 50.00
    console.log("Setting price...");
    await page.getByLabel('Price (Satang)').fill('5000');
    
    console.log("Saving product...");
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    
    // Verify product exists in table
    await expect(page.locator('table')).toContainText('Espresso', { timeout: 15000 });
    console.log("Product created successfully.");

    // 3. Complete Sale in POS
    console.log("Navigating to Main Page...");
    await navigateTo(page, null, 'Main Page');
    
    // Wait for the grid to be visible and stable
    console.log("Waiting for product grid...");
    const grid = page.locator('.grid.relative');
    await grid.waitFor({ state: 'visible', timeout: 20000 });

    // Find and click the Espresso product card
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Espresso' });
    await productCard.waitFor({ state: 'visible', timeout: 20000 });
    console.log("Adding Espresso to cart...");
    await clickElement(page, productCard);
    
    // Verify it's in the cart
    await expect(page.locator('aside')).toContainText('Espresso', { timeout: 10000 });
    
    // Click Checkout/Charge
    console.log("Checking out...");
    await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
    
    // Payment Modal
    await expect(page.locator('div:has-text("Cash Payment")')).toBeVisible({ timeout: 10000 });
    
    // Click "Exact"
    const exactBtn = page.getByRole('button', { name: /Exact|฿50\.00/i });
    if (await exactBtn.isVisible()) {
        await clickElement(page, exactBtn);
    } else {
        await clickElement(page, page.locator('button.border-primary\\/20').first());
    }
    
    // Confirm Payment
    console.log("Confirming payment...");
    await clickElement(page, page.getByRole('button', { name: /Confirm|Complete|Pay/i }));
    
    // Modal should close
    await expect(page.locator('div:has-text("Cash Payment")')).toBeHidden({ timeout: 15000 });
    
    // Cart should be empty
    await expect(page.locator('aside')).toContainText(/Your cart is empty/i, { timeout: 10000 });
    console.log("Workflow completed successfully!");
  });
});
