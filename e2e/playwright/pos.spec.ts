import { test, expect, chromium, Page } from '@playwright/test';
import { performLogin, navigateTo, setInputValue, getMainPage } from './helpers';

test.describe('POS Full Workflow', () => {
  let browser: any;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
    page = await getMainPage(browser);
    
    // Perform initial setup/login
    await performLogin(page);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('should create a category and a product, then complete a sale', async () => {
    // 1. Create Category
    await navigateTo(page, 'Management', 'Categories');
    await page.getByRole('button', { name: /New Category/i }).click();
    await setInputValue(page, 'input[placeholder="e.g., Coffee"]', 'Beverages');
    await page.getByRole('button', { name: /Save Category/i }).click();
    
    // Verify category exists in table
    await expect(page.locator('table')).toContainText('Beverages');

    // 2. Create Product
    await navigateTo(page, 'Management', 'Product Management');
    await page.getByRole('button', { name: /New Product/i }).click();
    await setInputValue(page, 'label:has-text("Title") + input', 'Espresso');
    
    // Select Category (Custom Select component)
    // Click the select trigger
    await page.locator('div:has-text("Select Category")').last().click();
    // Click the option by text
    await page.locator('div.bg-popover').getByText('Beverages', { exact: true }).click();
    
    // Set Price (Satang) - 5000 satang = 50.00
    await setInputValue(page, 'input[type="number"]', '5000');
    
    await page.getByRole('button', { name: /Save Product/i }).click();
    
    // Verify product exists in table
    await expect(page.locator('table')).toContainText('Espresso');

    // 3. Complete Sale in POS
    await navigateTo(page, null, 'Main Page');
    
    // Find and click the Espresso product card
    const productCard = page.locator('div.bg-card').filter({ hasText: 'Espresso' });
    await productCard.waitFor({ state: 'visible' });
    await productCard.click();
    
    // Verify it's in the cart
    await expect(page.locator('aside')).toContainText('Espresso');
    
    // Click Checkout/Charge
    await page.getByRole('button', { name: /Charge|Checkout/i }).click();
    
    // Payment Modal
    await expect(page.locator('div:has-text("Cash Payment")')).toBeVisible();
    
    // Click "Exact" or use numpad. 
    // Usually there's a button with the total amount or "Exact Amount"
    const exactBtn = page.getByRole('button', { name: /Exact|฿50\.00/i });
    if (await exactBtn.isVisible()) {
        await exactBtn.click();
    } else {
        // Fallback: click first quick amount button (usually outline)
        await page.locator('button.border-primary\\/20').first().click();
    }
    
    // Confirm Payment
    await page.getByRole('button', { name: /Confirm|Complete|Pay/i }).click();
    
    // Modal should close
    await expect(page.locator('div:has-text("Cash Payment")')).toBeHidden();
    
    // Cart should be empty
    await expect(page.locator('aside')).toContainText(/Your cart is empty/i);
  });
});
