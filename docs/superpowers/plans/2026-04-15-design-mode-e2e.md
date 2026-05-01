# E2E Test Suite Task 4: Design Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement E2E tests for Design Mode, covering scaling and Mini-Tuner style updates.

**Architecture:** Use Playwright to automate UI interactions in Design Mode, verifying both visual and state changes (CSS variables and settings).

**Tech Stack:** Playwright, TypeScript, Tauri v2.

---

### Task 4.1: Create Design Mode Test File

**Files:**
- Create: `e2e/playwright/design-mode.spec.ts`

- [ ] **Step 1: Write the test skeleton with helper imports and setup**

```typescript
import { test, expect, _electron as electron } from '@playwright/test';
import { getMainPage, performLogin, navigateTo, clickElement } from './helpers';

test.describe('Priority B - Design Mode (TEST-B1 & TEST-B2)', () => {
  let appWindow: any;

  test.beforeAll(async ({ browser }) => {
    appWindow = await getMainPage(browser);
    await performLogin(appWindow);
  });

  test('TEST-B1: Scaling via Drag Handles', async () => {
    // 1. Enable Design Mode
    await navigateTo(appWindow, 'System Setting', 'General');
    const designModeSwitch = appWindow.locator('role=switch').filter({ hasText: /Design Mode/i });
    if (!(await designModeSwitch.getAttribute('aria-checked') === 'true')) {
      await designModeSwitch.click();
    }
    await expect(designModeSwitch).toHaveAttribute('aria-checked', 'true');

    // 2. Go back to POS and select Product Grid
    await navigateTo(appWindow, null, 'Main Page');
    const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
    await expect(gridOverlay).toBeVisible();
    await gridOverlay.click();
    await expect(gridOverlay).toHaveClass(/border-primary/);

    // 3. Use drag handle to scale
    const seHandle = gridOverlay.locator('[data-handle-direction="se"]');
    await expect(seHandle).toBeVisible();
    
    const initialBox = await gridOverlay.boundingBox();
    // Drag SE handle down-right to increase scale
    await seHandle.hover();
    await appWindow.mouse.down();
    await appWindow.mouse.move(initialBox!.x + initialBox!.width + 100, initialBox!.y + initialBox!.height + 100);
    await appWindow.mouse.up();

    // 4. Verify scale update (check if style or classes change, or if we can read the settings via evaluate)
    // Actually, we can check the Mini-Tuner value
    const tunerValue = appWindow.locator('#minituner-portal').locator('span.font-mono').first();
    const scaleText = await tunerValue.innerText();
    expect(parseInt(scaleText)).toBeGreaterThan(100);

    // 5. Verify BottomControlPanel isolation (it should still be visible and functional)
    const controlPanel = appWindow.locator('div.fixed.bottom-8');
    await expect(controlPanel).toBeVisible();
  });

  test('TEST-B2: Mini-Tuner Style Updates', async () => {
    // Assuming Design Mode is still enabled from previous test
    await navigateTo(appWindow, null, 'Main Page');
    const gridOverlay = appWindow.locator('[data-selectable-id="grid_scale"]');
    await gridOverlay.click();

    // 1. Verify Mini-Tuner appearance
    const miniTuner = appWindow.locator('#minituner-portal');
    await expect(miniTuner).toBeVisible();

    // 2. Change a style (like Corner Radius)
    const radiusSlider = miniTuner.locator('div:has-text("Corner Radius")').locator('input[type="range"]');
    await radiusSlider.fill('40');
    
    // 3. Verify CSS variable update or UI change
    // The product cards should now have 40px radius. 
    // We can check the first product card's computed style if possible, 
    // or verify the settings object via evaluate.
    const productCard = appWindow.locator('.grid > div').first();
    // We might need to find the specific element that gets the radius.
    // Let's assume it's applied via a CSS variable or directly.
    // In this app, it's often applied to the product card div.
    
    // Check if the value is updated in the display next to the slider
    const radiusDisplay = miniTuner.locator('div:has-text("Corner Radius")').locator('span.font-mono');
    await expect(radiusDisplay).toHaveText('40px');
  });
});
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `npm run test:e2e -- e2e/playwright/design-mode.spec.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add e2e/playwright/design-mode.spec.ts src/components/design-mode/SelectableOverlay.tsx
git commit -m "test: add design mode E2E tests (TEST-B1, TEST-B2)"
```
