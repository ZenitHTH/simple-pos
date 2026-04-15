# Comprehensive E2E Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive Playwright E2E test suite covering all major POS workflows with full isolation using in-memory databases.

**Architecture:** Tests are split into functional modules (Inventory, Management, Reporting, Design) to ensure high signal and easy maintenance. Each test run utilizes the `VIBE_POS_IN_MEMORY` flag for 100% state isolation.

**Tech Stack:** Playwright, TypeScript, Tauri v2 (Linux/WSLg).

---

### Task 1: Priority A - Inventory & Recipes

**Files:**
- Create: `e2e/playwright/inventory-recipes.spec.ts`
- Modify: `e2e/playwright/helpers.ts` (if new navigation helpers needed)

- [ ] **Step 1: Implement TEST-A1 (Golden Path)**
Write the spec for creating a material, a product, linking them via the Recipe Builder, and verifying stock deduction after a POS sale.

```typescript
import { test, expect, chromium } from '@playwright/test';
import { performLogin, navigateTo, getMainPage, clickElement } from './helpers';

test.describe('Inventory & Recipes', () => {
  let browser: any;
  let page: any;

  test.beforeAll(async () => {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9223');
    page = await getMainPage(browser);
    await performLogin(page);
  });

  test('TEST-A1: Golden Path Lifecycle', async () => {
    // 1. Create Material
    await navigateTo(page, 'Management', 'Material Management');
    await clickElement(page, page.getByRole('button', { name: /New Material/i }));
    await page.getByLabel('Name').fill('Coffee Beans');
    await page.getByLabel('Volume').fill('1000');
    await clickElement(page, page.getByRole('button', { name: /Save Material/i }));

    // 2. Create Product
    await navigateTo(page, 'Management', 'Product Management');
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.getByLabel('Title').fill('Double Espresso');
    await page.getByLabel('Price (Satang)').fill('5000');
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));

    // 3. Build Recipe (Simplified for first pass)
    // Note: Actual implementation might need specific locators for the Flow Builder nodes
    await navigateTo(page, 'Management', 'Recipe');
    // ... recipe connection logic ...

    // 4. Perform Sale
    await navigateTo(page, null, 'Main Page');
    await clickElement(page, page.locator('.tuner-card').filter({ hasText: 'Double Espresso' }));
    await clickElement(page, page.getByRole('button', { name: /Charge/i }));
    await clickElement(page, page.getByRole('button', { name: /Confirm Payment/i }));

    // 5. Verify Stock
    await navigateTo(page, 'Management', 'Material Management');
    await expect(page.locator('table')).toContainText('982');
  });
});
```

- [ ] **Step 2: Implement TEST-A2 (Decimal Precision)**
Add a test case for fractional stock deduction (e.g., 0.5 units).

- [ ] **Step 3: Run Priority A tests**
Run: `npm run test:e2e -- --skip-build e2e/playwright/inventory-recipes.spec.ts`
Expected: PASS (or identify bugs in recipe/stock sync).

- [ ] **Step 4: Commit**
```bash
git add e2e/playwright/inventory-recipes.spec.ts
git commit -m "test: add priority A inventory and recipe tests"
```

---

### Task 2: Priority C - Advanced Management

**Files:**
- Create: `e2e/playwright/advanced-management.spec.ts`

- [ ] **Step 1: Implement TEST-C1 (Tagging)**
Create material with tags and verify filtering works in the table.

- [ ] **Step 2: Implement TEST-C3 (Customer Protection)**
Create customer, perform sale, and verify deletion is blocked.

- [ ] **Step 3: Run Priority C tests**
Run: `npm run test:e2e -- --skip-build e2e/playwright/advanced-management.spec.ts`

- [ ] **Step 4: Commit**
```bash
git add e2e/playwright/advanced-management.spec.ts
git commit -m "test: add priority C advanced management tests"
```

---

### Task 3: Priority D - Reporting & History

**Files:**
- Create: `e2e/playwright/reporting-history.spec.ts`

- [ ] **Step 1: Implement TEST-D1 (Report Export)**
Verify that exporting a report triggers a download or success state.

- [ ] **Step 2: Implement TEST-D2 (Search)**
Search for a past receipt by ID and verify details.

- [ ] **Step 3: Run Priority D tests**
Run: `npm run test:e2e -- --skip-build e2e/playwright/reporting-history.spec.ts`

- [ ] **Step 4: Commit**
```bash
git add e2e/playwright/reporting-history.spec.ts
git commit -m "test: add priority D reporting and history tests"
```

---

### Task 4: Priority B - Design Mode

**Files:**
- Create: `e2e/playwright/design-mode.spec.ts`

- [ ] **Step 1: Implement TEST-B1 (Scaling)**
Enable Design Mode, scale an element, and verify isolation of the bottom bar.

- [ ] **Step 2: Implement TEST-B2 (Mini-Tuner)**
Verify Mini-Tuner appearance and style updates (Radius/Color).

- [ ] **Step 3: Run Priority B tests**
Run: `npm run test:e2e -- --skip-build e2e/playwright/design-mode.spec.ts`

- [ ] **Step 4: Commit**
```bash
git add e2e/playwright/design-mode.spec.ts
git commit -m "test: add priority B design mode tests"
```
