import { test, expect, chromium, Page } from '@playwright/test';
import { performLogin, navigateTo, setInputValue, getMainPage, clickElement } from './helpers';

test.describe('POS Full Workflow', () => {
  let browser: any;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
    page = await getMainPage(browser);
    
    // Perform initial setup/login
    await performLogin(page);
  });

  test('should create a category and a product, then complete a sale', async () => {
    // 1. Create Category
    await navigateTo(page, 'Management', 'Categories');
    await clickElement(page, page.getByRole('button', { name: /New Category/i }));
    await setInputValue(page, 'input[placeholder="e.g., Coffee"]', 'Beverages');
    await clickElement(page, page.getByRole('button', { name: /Save Category/i }));
    
    // Verify category exists in table
    await expect(page.locator('table')).toContainText('Beverages');

    // 2. Create Product
    await navigateTo(page, 'Management', 'Product Management');
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await setInputValue(page, 'label:has-text("Title") + input', 'Espresso');
    
    // Select Category (Custom Select component)
    // Click the select trigger
    await clickElement(page, page.locator('div:has-text("Select Category")').last());
    // Click the option by text
    await clickElement(page, page.locator('div.bg-popover').getByText('Beverages', { exact: true }));
    
    // Set Price (Satang) - 5000 satang = 50.00
    await setInputValue(page, 'input[type="number"]', '5000');
    
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    
    // Verify product exists in table
    await expect(page.locator('table')).toContainText('Espresso');

    // 3. Complete Sale in POS
    await navigateTo(page, null, 'Main Page');
    
    // Wait for the grid to be visible and stable
    const grid = page.locator('.grid.relative');
    await grid.waitFor({ state: 'visible', timeout: 15000 });

    // Find and click the Espresso product card
    // The selector is now .tuner-card after the refactor
    const productCard = page.locator('.tuner-card').filter({ hasText: 'Espresso' });
    await productCard.waitFor({ state: 'visible', timeout: 15000 });
    await clickElement(page, productCard);
    
    // Verify it's in the cart
    await expect(page.locator('aside')).toContainText('Espresso');
    
    // Click Checkout/Charge
    await clickElement(page, page.getByRole('button', { name: /Charge|Checkout/i }));
    
    // Payment Modal
    await expect(page.locator('div:has-text("Cash Payment")')).toBeVisible();
    
    // Click "Exact" or use numpad. 
    // Usually there's a button with the total amount or "Exact Amount"
    const exactBtn = page.getByRole('button', { name: /Exact|฿50\.00/i });
    if (await exactBtn.isVisible()) {
        await clickElement(page, exactBtn);
    } else {
        // Fallback: click first quick amount button (usually outline)
        await clickElement(page, page.locator('button.border-primary\\/20').first());
    }
    
    // Confirm Payment
    await clickElement(page, page.getByRole('button', { name: /Confirm|Complete|Pay/i }));
    
    // Modal should close
    await expect(page.locator('div:has-text("Cash Payment")')).toBeHidden();
    
    // Cart should be empty
    await expect(page.locator('aside')).toContainText(/Your cart is empty/i);
  });
});
