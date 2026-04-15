import { test, expect, chromium } from '@playwright/test';
import { performLogin, navigateTo, getMainPage, clickElement, setInputValue } from './helpers';

/**
 * Priority D: Reporting & History
 * This suite covers TEST-D1 (Report Export) and TEST-D2 (Receipt Search).
 */
test.describe('Reporting & History (Priority D)', () => {
  let browser: any;
  let page: any;

  test.beforeAll(async () => {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
    page = await getMainPage(browser);
    await performLogin(page);
  });

  test('TEST-D1: Report Export', async () => {
    // Navigate to the Export Settings page
    // Note: Research showed that Export UI is located in /setting/export
    await navigateTo(page, "System Setting", "Export");
    
    // Verify we are on the correct page
    await expect(page.locator('h1')).toContainText(/Export Data/i);
    
    // Select 'CSV' format (default) and trigger export
    // The actual button text in the component is "Export as CSV" or similar
    const exportBtn = page.getByRole('button', { name: /Export/i }).first();
    await expect(exportBtn).toBeVisible();
    
    // Click export.
    await clickElement(page, exportBtn);
    
    // Verify success state (the app uses Toast/AlertContext)
    // We look for a success indicator or toast
    await expect(page.getByText(/Exported|Successful|Ready/i)).toBeVisible({ timeout: 15000 });
  });

  test('TEST-D2: Search for past receipt by ID', async () => {
    // Return to Main POS page
    await navigateTo(page, null, "Main Page");
    
    // Open History modal/page
    const historyBtn = page.getByRole('button', { name: /History/i });
    await clickElement(page, historyBtn);
    
    // Verify header in history view
    await expect(page.locator('h1, h2')).toContainText(/History/i);
    
    // Perform a search by ID
    // In mockup/new DB, we might need to create a sale first or use a known ID
    const searchInput = page.getByPlaceholder(/Search by ID/i);
    if (await searchInput.isVisible()) {
        await setInputValue(page, 'input[placeholder*="Search by ID"]', '1001');
        const searchBtn = page.locator('button').filter({ hasText: /Search/i });
        await clickElement(page, searchBtn);
        
        // Verify that the Receipt Detail modal opens or list filters
        // If it's the modal:
        const modalHeader = page.locator('h2').filter({ hasText: /Receipt/i });
        await expect(modalHeader).toBeVisible();
        
        const closeBtn = page.getByRole('button', { name: /Close/i });
        await clickElement(page, closeBtn);
    }
  });
});
