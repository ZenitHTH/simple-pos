# Replace Alert with Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace native browser `alert()` with the application's `Toast` system in the product management hook and verify it with an E2E test that specifically triggers a duplicate name error.

**Architecture:** Use the existing `ToastContext` to trigger notifications from the `useProductManagement` hook. Update the Playwright E2E suite to handle toast verification and interaction.

**Tech Stack:** React, Next.js, Playwright, Tailwind CSS.

---

### Task 1: Update useProductManagement Hook

**Files:**
- Modify: `src/app/manage/hooks/useProductManagement.ts`

- [ ] **Step 1: Update imports and initialize showToast**

```typescript
// Add import
import { useToast } from "@/context/ToastContext";

// Inside useProductManagement function:
export function useProductManagement() {
  const { dbKey } = useDatabase();
  const { showToast } = useToast(); // Add this
  // ... rest of state
```

- [ ] **Step 2: Replace alert calls with showToast**

Replace `alert(err);` or `alert("...");` with `showToast(String(err), "error");`.

```typescript
// Example replacement in handleDelete:
    } catch (err) {
      logger.error("Failed to delete product:", err);
      showToast(String(err), "error");
    }

// Example replacement in handleModalSubmit:
    } catch (err) {
      logger.error("Failed to save product:", err);
      showToast(String(err), "error");
    }

// Example replacement in handleToggleStockMode:
    } catch (err) {
      // ... rollback logic
      logger.error("Failed to toggle stock mode:", err);
      showToast("Failed to toggle stock mode", "error");
    }
```

- [ ] **Step 3: Verify no native alert remains in this file**

Run: `grep "alert(" src/app/manage/hooks/useProductManagement.ts`
Expected: No matches (except for maybe `confirm` which is still okay for now, or replace it if requested). The user asked for "duplicate name" alert, which happens in `handleModalSubmit`.

- [ ] **Step 4: Commit**

```bash
git add src/app/manage/hooks/useProductManagement.ts
git commit -m "feat: replace native alert with Toast in product management"
```

---

### Task 2: Add Duplicate Name E2E Test

**Files:**
- Modify: `e2e/playwright/vibe-pos.spec.ts`

- [ ] **Step 1: Add duplicate product name test case**

Add this test after the initial POS workflow test.

```typescript
  test('Step 3: Verify Duplicate Product Name Alert', async () => {
    console.log("Navigating to Product Management for duplicate check...");
    await navigateTo(page, 'Management', 'Product Management');
    
    console.log("Attempting to create duplicate product 'Espresso'...");
    await clickElement(page, page.getByRole('button', { name: /New Product/i }));
    await page.waitForTimeout(500);
    
    await page.locator('div:has(> label:text-is("Title")) input').fill('Espresso');
    
    // Select Category
    const categoryTrigger = page.locator('div:has(> label:text-is("Category"))').locator('.relative > div').first();
    await clickElement(page, categoryTrigger);
    const option = page.locator('div.bg-popover').getByText('Beverages', { exact: true });
    await clickElement(page, option);
    
    await page.locator('div:has(> label:text-is("Price (Satang)")) input').fill('1000');
    
    console.log("Saving duplicate product...");
    await clickElement(page, page.getByRole('button', { name: /Save Product/i }));
    
    // Verify Toast appears
    console.log("Verifying toast notification...");
    const toast = page.locator('div[role="alert"]').or(page.locator('.bg-card\\/95')).filter({ hasText: /exists/i });
    await expect(toast).toBeVisible({ timeout: 10000 });
    
    // Click close on toast
    console.log("Closing toast...");
    const closeBtn = toast.locator('button');
    await clickElement(page, closeBtn);
    
    // Verify Toast is hidden
    await expect(toast).toBeHidden({ timeout: 5000 });
    console.log("Toast closed successfully.");
    
    // Close modal
    await clickElement(page, page.getByRole('button', { name: /Cancel/i }).or(page.locator('button:has-text("Cancel")')));
  });
```

- [ ] **Step 2: Run E2E tests to verify**

Run: `npm run test:e2e`
Expected: ALL tests pass, including the new duplicate name check.

- [ ] **Step 3: Commit**

```bash
git add e2e/playwright/vibe-pos.spec.ts
git commit -m "test: add duplicate product name toast verification"
```
