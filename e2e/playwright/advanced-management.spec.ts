import { test, expect, chromium } from '@playwright/test';
import { logger } from './logger';
import { performLogin, navigateTo, getMainPage, clickElement } from './helpers';

test.describe('Advanced Management (Priority C)', () => {
  let browser: any;
  let page: any;

  test.beforeAll(async () => {
    logger.info("Connecting to Tauri via CDP...");
    browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
    page = await getMainPage(browser);
    await performLogin(page);
    logger.info("Connected and logged in.");
  });

  test('TEST-C1: Material Tagging & Filtering', async () => {
    logger.info("Starting TEST-C1: Material Tagging & Filtering...");
    // 1. Navigate to Material Management (Inventory -> Raw Materials tab)
    await navigateTo(page, 'Management', 'Inventory & Stock');
    
    // Switch to Raw Materials tab
    const materialsTab = page.getByRole('button', { name: /Raw Materials/i });
    await clickElement(page, materialsTab);

    // 2. Create Material with Tags
    logger.info("Creating new material with tags...");
    await clickElement(page, page.getByRole('button', { name: /New Material/i }));
    await page.getByLabel('Name').fill('Organic Coffee');
    await page.getByLabel('Volume').fill('500');
    await page.getByLabel('Quantity').fill('10');
    
    // Select Type/Unit (Custom Select)
    const typeTrigger = page.locator('div:has(> label:text-is("Type / Unit"))').locator('.relative > div').first();
    await clickElement(page, typeTrigger);
    await clickElement(page, page.locator('div.bg-popover').getByText('Ingredient', { exact: true }));

    // Add Tags
    const tagInput = page.getByPlaceholder(/Add a tag/i);
    await tagInput.fill('Organic');
    await page.keyboard.press('Enter');
    await tagInput.fill('Dark Roast');
    await page.keyboard.press('Enter');

    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));
    logger.info("Material created.");

    // 3. Verify Filtering
    logger.info("Verifying filtering by tag...");
    // Assuming tags are shown as pill buttons in a filter area
    const organicTagFilter = page.locator('.pill-group button').filter({ hasText: 'Organic' });
    await clickElement(page, organicTagFilter);
    
    // Table should contain 'Organic Coffee'
    await expect(page.locator('table')).toContainText('Organic Coffee');
    
    // Deselect Organic, select something else (if exists)
    await clickElement(page, organicTagFilter);
    logger.info("TEST-C1 completed.");
  });

  test('TEST-C3: Customer Management & Protection', async () => {
    logger.info("Starting TEST-C3: Customer Management & Protection...");
    // 1. Create Customer
    await navigateTo(page, 'Management', 'Customers');
    await clickElement(page, page.getByRole('button', { name: /New Customer/i }));
    
    logger.info("Creating customer Alice Tester...");
    await page.getByLabel(/Name/i).fill('Alice Tester');
    await page.getByLabel(/Tax ID/i).fill('1234567890123');
    await clickElement(page, page.getByRole('button', { name: /Save Customer/i }));
    
    await expect(page.locator('table')).toContainText('Alice Tester');

    // 2. Link to Sale
    logger.info("Linking customer to a new sale...");
    await navigateTo(page, null, 'Main Page');
    
    // Add any product to cart
    const productCard = page.locator('.tuner-card').first();
    await clickElement(page, productCard);
    
    // Open Customer Selector
    await clickElement(page, page.getByRole('button', { name: /Add Customer/i }));
    await page.getByPlaceholder(/Search customers/i).fill('Alice Tester');
    await clickElement(page, page.getByText('Alice Tester'));
    
    // Complete Sale
    logger.info("Completing sale...");
    await clickElement(page, page.getByRole('button', { name: /Charge/i }));
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));

    // 3. Verify Deletion Block
    logger.info("Verifying that customer deletion is blocked due to active receipts...");
    await navigateTo(page, 'Management', 'Customers');
    
    // Click Delete for Alice
    const aliceRow = page.locator('tr').filter({ hasText: 'Alice Tester' });
    const deleteBtn = aliceRow.getByRole('button', { name: /Delete/i });
    await clickElement(page, deleteBtn);
    
    // Confirm in modal
    await clickElement(page, page.getByRole('button', { name: /OK|Confirm|Delete/i }));

    // Verify error alert shows dependency message
    const alert = page.getByRole('alertdialog');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/receipt/i);
    
    await clickElement(page, alert.getByRole('button', { name: /OK/i }));
    logger.info("TEST-C3 completed: Deletion block verified.");
  });
});
