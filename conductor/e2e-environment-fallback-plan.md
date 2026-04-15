# E2E Environment Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modify the E2E tests to gracefully fall back to testing the Next.js frontend directly (using the mock API) when the Tauri CDP connection fails, which is expected on Linux and WSL environments using WebKit2GTK.

**Architecture:** 
- Add `setupTestBrowser` helper in `e2e/playwright/helpers.ts` that attempts `chromium.connectOverCDP` and falls back to `chromium.launch` navigating to `http://127.0.0.1:3000`.
- Refactor all `.spec.ts` files to use `setupTestBrowser` instead of manually connecting to CDP.

---

### Task 1: Update Helpers

**Files:**
- Modify: `e2e/playwright/helpers.ts`

- [ ] **Step 1: Add `setupTestBrowser`**
Add the connection fallback logic to `helpers.ts`.

---

### Task 2: Refactor Specs

**Files:**
- Modify: `e2e/playwright/vibe-pos.spec.ts`
- Modify: `e2e/playwright/inventory-recipes.spec.ts`
- Modify: `e2e/playwright/advanced-management.spec.ts`
- Modify: `e2e/playwright/reporting-history.spec.ts`
- Modify: `e2e/playwright/design-mode.spec.ts`

- [ ] **Step 1: Use `setupTestBrowser`**
Replace the `beforeAll` connection blocks in all spec files to use the new helper function.