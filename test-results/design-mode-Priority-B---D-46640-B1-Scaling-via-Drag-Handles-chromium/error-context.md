# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: design-mode.spec.ts >> Priority B - Design Mode (TEST-B1 & TEST-B2) >> TEST-B1: Scaling via Drag Handles
- Location: e2e/playwright/design-mode.spec.ts:22:7

# Error details

```
Error: browserType.connectOverCDP: socket hang up
Call log:
  - <ws preparing> retrieving websocket url from http://127.0.0.1:9223

```

# Test source

```ts
  1   | import { test, expect, chromium } from '@playwright/test';
  2   | import { logger } from './logger';
  3   | import { getMainPage, performLogin, navigateTo, getCDPUrl } from './helpers';
  4   | 
  5   | test.describe('Priority B - Design Mode (TEST-B1 & TEST-B2)', () => {
  6   |   let appWindow: any;
  7   |   let browser: any;
  8   | 
  9   |   test.beforeAll(async () => {
  10  |     logger.info("Connecting to Tauri via CDP...");
  11  |     try {
  12  |       const cdpUrl = await getCDPUrl('http://127.0.0.1:9223');
> 13  |       browser = await chromium.connectOverCDP(cdpUrl, { timeout: 30000 });
      |                                ^ Error: browserType.connectOverCDP: socket hang up
  14  |       appWindow = await getMainPage(browser);
  15  |       await performLogin(appWindow);
  16  |     } catch (err) {
  17  |       logger.error("Failed to initialize test context:", err);
  18  |       throw err;
  19  |     }
  20  |   });
  21  | 
  22  |   test('TEST-B1: Scaling via Drag Handles', async () => {
  23  |     // 1. Enable Design Mode
  24  |     logger.info("Navigating to General Settings...");
  25  |     await navigateTo(appWindow, 'System Setting', 'General');
  26  |     
  27  |     const designModeSwitch = appWindow.locator('button[role="switch"]').filter({ hasText: /Design Mode/i });
  28  |     
  29  |     // Check if already checked
  30  |     const isChecked = await designModeSwitch.getAttribute('aria-checked');
  31  |     if (isChecked !== 'true') {
  32  |       logger.info("Enabling Design Mode...");
  33  |       await designModeSwitch.click();
  34  |       await appWindow.waitForTimeout(1000);
  35  |     }
  36  |     
  37  |     await expect(designModeSwitch).toHaveAttribute('aria-checked', 'true');
  38  | 
  39  |     // 2. Go back to POS and select Product Grid
  40  |     logger.info("Navigating to Main Page...");
  41  |     await navigateTo(appWindow, null, 'Main Page');
  42  |     
  43  |     const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
  44  |     await expect(gridOverlay).toBeVisible({ timeout: 15000 });
  45  |     
  46  |     logger.info("Selecting Product Grid...");
  47  |     await gridOverlay.click();
  48  |     await expect(gridOverlay).toHaveClass(/border-primary/);
  49  | 
  50  |     // 3. Use drag handle to scale
  51  |     const seHandle = gridOverlay.locator('[data-handle-direction="se"]');
  52  |     await expect(seHandle).toBeVisible();
  53  |     
  54  |     const initialBox = await gridOverlay.boundingBox();
  55  |     if (!initialBox) throw new Error("Could not get bounding box for grid overlay");
  56  | 
  57  |     logger.info(`Initial box: ${JSON.stringify(initialBox)}`);
  58  |     
  59  |     // Drag SE handle down-right to increase scale
  60  |     // We need to move the mouse precisely
  61  |     await seHandle.hover();
  62  |     await appWindow.mouse.down();
  63  |     // Move 100px right and 100px down
  64  |     await appWindow.mouse.move(initialBox.x + initialBox.width + 100, initialBox.y + initialBox.height + 100, { steps: 10 });
  65  |     await appWindow.mouse.up();
  66  |     
  67  |     await appWindow.waitForTimeout(1000);
  68  | 
  69  |     // 4. Verify scale update via Mini-Tuner value
  70  |     // The Mini-Tuner should have appeared after selection
  71  |     const miniTuner = appWindow.locator('#minituner-portal');
  72  |     await expect(miniTuner).toBeVisible();
  73  |     
  74  |     const tunerValue = miniTuner.locator('span.font-mono').first();
  75  |     const scaleText = await tunerValue.innerText();
  76  |     logger.info(`Current scale text: ${scaleText}`);
  77  |     expect(parseInt(scaleText)).toBeGreaterThan(100);
  78  | 
  79  |     // 5. Verify BottomControlPanel isolation
  80  |     const controlPanel = appWindow.locator('div.fixed.bottom-8');
  81  |     await expect(controlPanel).toBeVisible();
  82  |   });
  83  | 
  84  |   test('TEST-B2: Mini-Tuner Style Updates', async () => {
  85  |     // Assuming Design Mode is still enabled
  86  |     logger.info("Selecting Product Grid for Mini-Tuner test...");
  87  |     const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
  88  |     await gridOverlay.click();
  89  | 
  90  |     // 1. Verify Mini-Tuner appearance
  91  |     const miniTuner = appWindow.locator('#minituner-portal');
  92  |     await expect(miniTuner).toBeVisible();
  93  | 
  94  |     // 2. Change a style (like Corner Radius)
  95  |     logger.info("Changing Corner Radius via Mini-Tuner slider...");
  96  |     // Find the Corner Radius slider
  97  |     const radiusSliderContainer = miniTuner.locator('div:has-text("Corner Radius")').last();
  98  |     const radiusSlider = radiusSliderContainer.locator('input[type="range"]');
  99  |     
  100 |     // Get initial value
  101 |     const initialRadius = await radiusSlider.inputValue();
  102 |     logger.info(`Initial radius: ${initialRadius}`);
  103 |     
  104 |     // Fill with a new value
  105 |     await radiusSlider.fill('45');
  106 |     await appWindow.waitForTimeout(500);
  107 |     
  108 |     // 3. Verify display update
  109 |     const radiusDisplay = radiusSliderContainer.locator('span.font-mono');
  110 |     await expect(radiusDisplay).toHaveText('45px');
  111 |     
  112 |     logger.info("Style update verified in Mini-Tuner display");
  113 |   });
```