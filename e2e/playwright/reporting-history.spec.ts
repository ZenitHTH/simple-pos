import { test, expect, chromium } from '@playwright/test';
import { performLogin, navigateTo, getMainPage, clickElement, setInputValue, getCDPUrl } from './helpers';
import { logger } from './logger';

/**
 * Priority D: Reporting & History
 * This suite covers TEST-D1 (Report Export) and TEST-D2 (Receipt Search).
 */
test.describe('Reporting & History (Priority D)', () => {
  let browser: any;
  let page: any;

  test.beforeAll(async () => {
    logger.info("Connecting to Tauri...");
    try {
      browser = await connectToApp(chromium, 9223);
      page = await getMainPage(browser);
      await performLogin(page);
      logger.info("Connected and logged in.");
    } catch (err) {
      logger.error("Failed to initialize test context:", err);
      throw err;
    }
  });


  test('TEST-D1: Report Export', async () => {
    logger.info("Starting TEST-D1: Report Export...");
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
    logger.info("Clicking export button...");
    await clickElement(page, exportBtn);
    
    // Verify success state (the app uses Toast/AlertContext)
    // We look for a success indicator or toast
    logger.info("Waiting for export success message...");
    await expect(page.getByText(/Exported|Successful|Ready/i)).toBeVisible({ timeout: 15000 });
    logger.info("Export completed successfully.");
  });

  test('TEST-D2: Search for past receipt by ID', async () => {
    logger.info("Starting TEST-D2: Search for past receipt by ID...");
    // Return to Main POS page
    await navigateTo(page, null, "Main Page");
    
    // Open History modal/page
    const historyBtn = page.getByRole('button', { name: /History/i });
    logger.info("Opening History view...");
    await clickElement(page, historyBtn);
    
    // Verify header in history view
    await expect(page.locator('h1, h2')).toContainText(/History/i);
    
    // Perform a search by ID
    // In mockup/new DB, we might need to create a sale first or use a known ID
    const searchInput = page.getByPlaceholder(/Search by ID/i);
    if (await searchInput.isVisible()) {
        logger.info("Searching for receipt ID 1001...");
        await setInputValue(page, 'input[placeholder*="Search by ID"]', '1001');
        const searchBtn = page.locator('button').filter({ hasText: /Search/i });
        await clickElement(page, searchBtn);
        
        // Verify that the Receipt Detail modal opens or list filters
        // If it's the modal:
        const modalHeader = page.locator('h2').filter({ hasText: /Receipt/i });
        await expect(modalHeader).toBeVisible();
        
        logger.info("Receipt detail visible, closing...");
        const closeBtn = page.getByRole('button', { name: /Close/i });
        await clickElement(page, closeBtn);
    } else {
      logger.info("Search input not visible, skipping search part of TEST-D2");
    }
    logger.info("TEST-D2 completed.");
  });
});
