# Comprehensive E2E Test Suite Design (2026-04-15)

## Overview
This document specifies a comprehensive End-to-End (E2E) testing suite for Vibe POS, utilizing Playwright and Tauri v2. The suite is designed to ensure high quality across core business logic, advanced management, reporting, and the visual design editor.

## Environmental Configuration
- **Runner**: Playwright (`npx playwright test`)
- **Target**: Tauri v2 Debug Binary (`src-tauri/target/debug/app`)
- **Isolation**: All tests MUST run with `VIBE_POS_IN_MEMORY=1` to ensure a fresh, non-persistent database for every execution.
- **Priority Order**: A (Inventory/Recipes) -> C (Advanced Management) -> D (Reporting/History) -> B (Design Mode)

---

## Priority A: Inventory & Recipes

### TEST-A1: The "Golden Path" Lifecycle
- **Goal**: Verify the entire workflow from material creation to stock deduction.
- **Steps**:
  1. Create Material "Coffee Beans" (g, 1000 qty, 0 precision).
  2. Create Product "Double Espresso" (Price: 50.00).
  3. Open Recipe Flow Builder for "Double Espresso".
  4. Drag connection from "Coffee Beans" to "Double Espresso".
  5. Set weight to 18g and Save.
  6. In POS, sell 1x "Double Espresso" (Cash Payment).
  7. Verify "Coffee Beans" stock is exactly 982.

### TEST-A2: Decimal Precision & Edge Cases
- **Goal**: Verify math integrity for fractional ingredients.
- **Steps**:
  1. Create Recipe for "Latte" using 0.5 units of "Vanilla Syrup".
  2. Perform 3 sales.
  3. Verify "Vanilla Syrup" stock reduction is exactly 1.5 units.
  4. Attempt sale of "Latte" when "Milk" is at 0.1 qty (required: 1.0).
  5. Verify UI prevents sale or shows "Out of Stock" warning.

---

## Priority C: Advanced Management

### TEST-C1: Material Tagging & Filtering
- **Goal**: Verify organization and search capabilities.
- **Steps**:
  1. Create materials with multiple tags (e.g., "Dairy", "Organic", "Dry").
  2. Filter by single and multiple tags in the Material table.
  3. Verify table content updates correctly according to filter selection.

### TEST-C2: Bulk Data Operations
- **Goal**: Ensure import/export stability for large datasets.
- **Steps**:
  1. Import 100 products via CSV/XLSX.
  2. Verify progress indicator and final product count.
  3. Export products to XLSX and verify file structure/content.

### TEST-C3: Customer Management
- **Goal**: Verify customer-transaction linking and deletion protection.
- **Steps**:
  1. Create customer "Alice".
  2. Link "Alice" to a new sale in POS.
  3. Verify "Alice" appears in the Receipt detail in History.
  4. Verify deletion of "Alice" is blocked due to active receipt dependencies.

---

## Priority D: Reporting & History

### TEST-D1: Sales Reports & Accuracy
- **Goal**: Verify data aggregation for accounting.
- **Steps**:
  1. Perform multiple sales across different categories.
  2. Export "Today's" report to XLSX.
  3. Verify "Total Revenue" and "Tax" in XLSX matches UI summaries.

### TEST-D2: History & Search
- **Goal**: Verify retrieval of past transactions.
- **Steps**:
  1. Complete a complex sale (multiple distinct items).
  2. Locate receipt in History list.
  3. Search for receipt by ID and verify details match original sale.

---

## Priority B: Design Mode (Live Editor)

### TEST-B1: Scaling & UI Isolation
- **Goal**: Verify layout customization doesn't break fixed UI components.
- **Steps**:
  1. Enable Design Mode.
  2. Select and scale a "Product Card" via corner drag handles.
  3. Verify element dimensions update.
  4. Verify the "BottomControlPanel" remains at 100% scale and fixed position.

### TEST-B2: Contextual Mini-Tuner
- **Goal**: Verify floating menu functionality and style updates.
- **Steps**:
  1. Select a Category Button.
  2. Verify Mini-Tuner appears and follows the element during drag.
  3. Change "Border Radius" in Mini-Tuner.
  4. Verify CSS variable update on the element.

### TEST-B3: Theme Presets & Persistence
- **Goal**: Verify global theme application and cross-session persistence.
- **Steps**:
  1. Apply "High Contrast" theme from the Library.
  2. Verify CSS classes/variables update on root element.
  3. Refresh/Restart app and verify theme remains active.

### TEST-B4: Color Sampler
- **Goal**: Verify image-based color extraction.
- **Steps**:
  1. Select product with image.
  2. Extract colors in Mini-Tuner.
  3. Apply a swatch and verify product accent color updates.
