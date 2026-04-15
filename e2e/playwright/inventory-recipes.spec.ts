import { test, expect, chromium, Page } from '@playwright/test';
import { performLogin, navigateTo, clickElement, getMainPage } from './helpers';

test.describe('Priority A - Inventory & Recipes', () => {
  let browser: any;
  let page: Page;

  test.beforeAll(async () => {
    console.log("Connecting to Tauri via CDP...");
    try {
      browser = await chromium.connectOverCDP('http://127.0.0.1:9223', { timeout: 30000 });
      page = await getMainPage(browser);
      await performLogin(page);
    } catch (err) {
      console.error("Failed to initialize test context:", err);
      throw err;
    }
  });

  test('TEST-A1: Golden Path - Recipe & Inventory Deduction', async () => {
    console.log("Starting TEST-A1...");

    // 1. Create Material "Coffee Beans"
    console.log("Navigating to Inventory & Stock...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    
    console.log("Switching to Raw Materials tab...");
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    console.log("Creating new material: Coffee Beans...");
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    
    await page.getByLabel('Material Name').fill('Coffee Beans');
    await page.getByLabel('Volume').fill('1000');
    await page.getByLabel('Quantity').fill('1');
    
    // Select Type: Weight (g)
    const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
    await clickElement(page, typeTrigger);
    await clickElement(page, page.locator('div.bg-popover').getByText('Weight (g)', { exact: true }));
    
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    
    // Verify material exists
    await expect(page.locator('table')).toContainText('Coffee Beans', { timeout: 10000 });
    console.log("Material 'Coffee Beans' created.");

    // 2. Create Product "Double Espresso"
    // First we need a category if it doesn't exist (from previous tests it might, but let's be safe)
    await navigateTo(page, 'Management', 'Categories');
    if (!(await page.locator('table').getByText('Beverages').isVisible())) {
      await clickElement(page, page.getByRole('button', { name: /New Category/i }));
      await page.locator('div:has(> label:text-is("Category Name")) input').fill('Beverages');
      await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
    }

    await navigateTo(page, 'Management', 'Product Management');
    console.log("Creating new product: Double Espresso...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    
    await page.getByLabel('Title').fill('Double Espresso');
    
    // Select Category
    const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
    await clickElement(page, categoryTrigger);
    await clickElement(page, page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
    
    // Set Price: 50.00 = 5000 satang
    await page.getByLabel('Price (Satang)').fill('5000');
    
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    await expect(page.locator('table')).toContainText('Double Espresso', { timeout: 10000 });
    console.log("Product 'Double Espresso' created.");

    // 3. Link in Recipe Builder
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    console.log("Navigating to Recipe Builder...");
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
    // Select "Double Espresso" in the right pane (Product Selection)
    console.log("Selecting Double Espresso in Recipe Builder...");
    await page.locator('input[placeholder*="Search products"]').fill('Double Espresso');
    const productItem = page.locator('div.bg-card').filter({ hasText: 'Double Espresso' }).first();
    await clickElement(page, productItem);
    
    // Add "Coffee Beans" from left pane
    console.log("Adding Coffee Beans to recipe...");
    await page.locator('input[placeholder*="Search materials"]').fill('Coffee Beans');
    const materialAddBtn = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).getByRole('button').first();
    await clickElement(page, materialAddBtn);
    
    // Set volume to 18g
    console.log("Setting recipe volume to 18g...");
    const volumeInput = page.locator('div.bg-card').filter({ hasText: 'Coffee Beans' }).locator('input[type="number"]');
    await volumeInput.fill('18');
    
    console.log("Saving recipe...");
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    
    // Wait for success message
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });
    console.log("Recipe saved.");

    // 4. Perform Sale
    console.log("Performing sale in POS...");
    await navigateTo(page, null, 'Main Page');
    
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Double Espresso' });
    await clickElement(page, productCard);
    
    await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
    const quickAmountBtn = page.locator('button.bg-primary\\/10').first();
    await clickElement(page, quickAmountBtn);
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
    
    // Wait for payment to complete
    await expect(page.getByText(/Your cart is empty|Cart is Empty/i)).toBeVisible({ timeout: 10000 });
    console.log("Sale completed.");

    // 5. Verify Stock
    console.log("Verifying stock deduction...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    // Stock should be 1000 - 18 = 982
    const coffeeBeansRow = page.locator('tr').filter({ hasText: 'Coffee Beans' });
    await expect(coffeeBeansRow).toContainText('982', { timeout: 10000 });
    console.log("TEST-A1 Passed: Stock is 982.");
  });

  test('TEST-A2: Decimal Precision - 0.5 unit recipe', async () => {
    console.log("Starting TEST-A2...");

    // 1. Create Material "Milk" (Volume 10, Quantity 1)
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    console.log("Creating new material: Milk...");
    await clickElement(page, page.getByRole('button', { name: /Add Raw Material/i }));
    await page.getByLabel('Material Name').fill('Milk');
    await page.getByLabel('Volume').fill('10');
    await page.getByLabel('Quantity').fill('1');
    const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
    await clickElement(page, typeTrigger);
    await clickElement(page, page.locator('div.bg-popover').getByText('Volume (L)', { exact: true }));
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    
    // 2. Create Product "Small Latte"
    await navigateTo(page, 'Management', 'Product Management');
    console.log("Creating new product: Small Latte...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.getByLabel('Title').fill('Small Latte');
    const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
    await clickElement(page, categoryTrigger);
    await clickElement(page, page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
    await page.getByLabel('Price (Satang)').fill('4000');
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));

    // 3. Link in Recipe Builder (0.5L Milk)
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    await clickElement(page, page.getByRole('link', { name: /Recipe Builder/i }));
    
    console.log("Setting recipe for Small Latte (0.5L Milk)...");
    await page.locator('input[placeholder*="Search products"]').fill('Small Latte');
    await clickElement(page, page.locator('div.bg-card').filter({ hasText: 'Small Latte' }).first());
    
    await page.locator('input[placeholder*="Search materials"]').fill('Milk');
    await clickElement(page, page.locator('div.bg-card').filter({ hasText: 'Milk' }).getByRole('button').first());
    
    const volumeInput = page.locator('div.bg-card').filter({ hasText: 'Milk' }).locator('input[type="number"]');
    await volumeInput.fill('0.5');
    await clickElement(page, page.getByRole('button', { name: /Save Recipe/i }));
    await expect(page.getByText(/Recipe saved successfully/i)).toBeVisible({ timeout: 10000 });

    // 4. Perform 3 Sales
    console.log("Performing 3 sales of Small Latte...");
    await navigateTo(page, null, 'Main Page');
    
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Small Latte' });
    
    for (let i = 0; i < 3; i++) {
      console.log(`Sale ${i + 1}/3...`);
      await clickElement(page, productCard);
      await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
      await clickElement(page, page.locator('button.bg-primary\\/10').first());
      await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));
      await expect(page.getByText(/Your cart is empty|Cart is Empty/i)).toBeVisible({ timeout: 10000 });
    }

    // 5. Verify Stock: 10 - (0.5 * 3) = 8.5
    console.log("Verifying stock deduction (10 - 1.5 = 8.5)...");
    await navigateTo(page, 'Management', 'Inventory & Stock');
    await clickElement(page, page.getByRole('button', { name: /Raw Materials/i }));
    
    const milkRow = page.locator('tr').filter({ hasText: 'Milk' });
    // Note: Stock display might have different precision, but should contain "8.5"
    await expect(milkRow).toContainText('8.5', { timeout: 10000 });
    console.log("TEST-A2 Passed: Stock is 8.5.");
  });
});
