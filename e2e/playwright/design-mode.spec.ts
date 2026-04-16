import { test, expect } from '@playwright/test';
import { logger } from './logger';
import { getMainPage, performLogin, navigateTo } from './helpers';

test.describe('Priority B - Design Mode (TEST-B1 & TEST-B2)', () => {
  let appWindow: any;

  test.beforeAll(async ({ browser }) => {
    appWindow = await getMainPage(browser);
    await performLogin(appWindow);
  });

  test('TEST-B1: Scaling via Drag Handles', async () => {
    // 1. Enable Design Mode
    logger.info("Navigating to General Settings...");
    await navigateTo(appWindow, 'System Setting', 'General');
    
    const designModeSwitch = appWindow.locator('button[role="switch"]').filter({ hasText: /Design Mode/i });
    
    // Check if already checked
    const isChecked = await designModeSwitch.getAttribute('aria-checked');
    if (isChecked !== 'true') {
      logger.info("Enabling Design Mode...");
      await designModeSwitch.click();
      await appWindow.waitForTimeout(1000);
    }
    
    await expect(designModeSwitch).toHaveAttribute('aria-checked', 'true');

    // 2. Go back to POS and select Product Grid
    logger.info("Navigating to Main Page...");
    await navigateTo(appWindow, null, 'Main Page');
    
    const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
    await expect(gridOverlay).toBeVisible({ timeout: 15000 });
    
    logger.info("Selecting Product Grid...");
    await gridOverlay.click();
    await expect(gridOverlay).toHaveClass(/border-primary/);

    // 3. Use drag handle to scale
    const seHandle = gridOverlay.locator('[data-handle-direction="se"]');
    await expect(seHandle).toBeVisible();
    
    const initialBox = await gridOverlay.boundingBox();
    if (!initialBox) throw new Error("Could not get bounding box for grid overlay");

    logger.info(`Initial box: ${JSON.stringify(initialBox)}`);
    
    // Drag SE handle down-right to increase scale
    // We need to move the mouse precisely
    await seHandle.hover();
    await appWindow.mouse.down();
    // Move 100px right and 100px down
    await appWindow.mouse.move(initialBox.x + initialBox.width + 100, initialBox.y + initialBox.height + 100, { steps: 10 });
    await appWindow.mouse.up();
    
    await appWindow.waitForTimeout(1000);

    // 4. Verify scale update via Mini-Tuner value
    // The Mini-Tuner should have appeared after selection
    const miniTuner = appWindow.locator('#minituner-portal');
    await expect(miniTuner).toBeVisible();
    
    const tunerValue = miniTuner.locator('span.font-mono').first();
    const scaleText = await tunerValue.innerText();
    logger.info(`Current scale text: ${scaleText}`);
    expect(parseInt(scaleText)).toBeGreaterThan(100);

    // 5. Verify BottomControlPanel isolation
    const controlPanel = appWindow.locator('div.fixed.bottom-8');
    await expect(controlPanel).toBeVisible();
  });

  test('TEST-B2: Mini-Tuner Style Updates', async () => {
    // Assuming Design Mode is still enabled
    logger.info("Selecting Product Grid for Mini-Tuner test...");
    const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
    await gridOverlay.click();

    // 1. Verify Mini-Tuner appearance
    const miniTuner = appWindow.locator('#minituner-portal');
    await expect(miniTuner).toBeVisible();

    // 2. Change a style (like Corner Radius)
    logger.info("Changing Corner Radius via Mini-Tuner slider...");
    // Find the Corner Radius slider
    const radiusSliderContainer = miniTuner.locator('div:has-text("Corner Radius")').last();
    const radiusSlider = radiusSliderContainer.locator('input[type="range"]');
    
    // Get initial value
    const initialRadius = await radiusSlider.inputValue();
    logger.info(`Initial radius: ${initialRadius}`);
    
    // Fill with a new value
    await radiusSlider.fill('45');
    await appWindow.waitForTimeout(500);
    
    // 3. Verify display update
    const radiusDisplay = radiusSliderContainer.locator('span.font-mono');
    await expect(radiusDisplay).toHaveText('45px');
    
    logger.info("Style update verified in Mini-Tuner display");
  });
});

