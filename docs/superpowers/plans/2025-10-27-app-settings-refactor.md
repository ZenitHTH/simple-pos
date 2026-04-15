# AppSettings Nested Structure Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor AppSettings property access and updates from a flat structure to a nested one across the codebase.

**Architecture:** Use the provided mapping guide to update property access (`settings.key` -> `settings.group.key`) and update calls (`updateSettings({ key: value })` -> `updateSettings({ group: { key: value } })`).

**Tech Stack:** TypeScript, React, Next.js.

---

### Task 1: Refactor General Settings

**Files:**
- `src/hooks/useTax.tsx`
- `src/hooks/useCurrency.tsx`
- `src/components/settings/SettingsSetup.tsx`
- `src/components/settings/GeneralSettings.tsx`
- `src/app/setting/tax/page.tsx`
- `src/app/setting/finance/page.tsx`
- `src/app/setting/currency/page.tsx`
- `src/app/setting/general/page.tsx`

- [ ] **Step 1: Update useTax.tsx**
    - `settings.tax_enabled` -> `settings.general.tax_enabled`
    - `settings.tax_rate` -> `settings.general.tax_rate`
    - `updateSettings({ tax_enabled: ... })` -> `updateSettings({ general: { tax_enabled: ... } })`
    - `updateSettings({ tax_rate: ... })` -> `updateSettings({ general: { tax_rate: ... } })`

- [ ] **Step 2: Update useCurrency.tsx**
    - `settings.currency_symbol` -> `settings.general.currency_symbol`
    - `updateSettings({ currency_symbol: ... })` -> `updateSettings({ general: { currency_symbol: ... } })`

- [ ] **Step 3: Update SettingsSetup.tsx (General part)**
    - `settings.currency_symbol` -> `settings.general.currency_symbol`
    - `settings.tax_enabled` -> `settings.general.tax_enabled`
    - `settings.tax_rate` -> `settings.general.tax_rate`
    - `updateSettings({ currency_symbol: ... })` -> `updateSettings({ general: { currency_symbol: ... } })`
    - `updateSettings({ tax_enabled: ... })` -> `updateSettings({ general: { tax_enabled: ... } })`
    - `updateSettings({ tax_rate: ... })` -> `updateSettings({ general: { tax_rate: ... } })`

- [ ] **Step 4: Update GeneralSettings.tsx**
    - `settings.image_storage_path` -> `settings.storage.image_storage_path`
    - `settings.db_storage_path` -> `settings.storage.db_storage_path`
    - `onUpdateSettings({ image_storage_path: ... })` -> `onUpdateSettings({ storage: { image_storage_path: ... } })`
    - `onUpdateSettings({ db_storage_path: ... })` -> `onUpdateSettings({ storage: { db_storage_path: ... } })`

- [ ] **Step 5: Update App Pages (tax, finance, currency, general)**
    - Apply similar mappings for `settings.general.*` and `settings.storage.*`.

### Task 2: Refactor Scaling Settings

**Files:**
- `src/components/settings/SettingsSetup.tsx`
- `src/components/settings/DisplaySettings.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/design-mode/BottomControlPanel.tsx`
- `src/components/design-mode/MiniTuner.tsx`
- `src/components/design-mode/ComponentScaleControls.tsx`
- `src/components/design-mode/SelectableOverlay.tsx`
- `src/components/design-tuner/SidebarTuner.tsx`
- `src/components/design-tuner/HistoryTuner.tsx`
- `src/components/design-tuner/GridTuner.tsx`
- `src/components/design-tuner/TunerSidebar.tsx`
- `src/components/ui/GlobalHeader.tsx`
- `src/components/history/HistoryHeader.tsx`
- `src/components/manage/CustomerTable.tsx`
- `src/app/history/page.tsx`

- [ ] **Step 1: Update Display Scale**
    - `settings.display_scale` -> `settings.scaling.display_scale`
    - `updateSettings({ display_scale: ... })` -> `updateSettings({ scaling: { display_scale: ... } })`

- [ ] **Step 2: Update Component Scales**
    - `settings.sidebar_scale` -> `settings.scaling.components.sidebar`
    - `settings.cart_scale` -> `settings.scaling.components.cart`
    - `settings.grid_scale` -> `settings.scaling.components.grid`
    - `settings.manage_table_scale` -> `settings.scaling.components.manage_table`
    - `settings.stock_table_scale` -> `settings.scaling.components.stock_table`
    - `settings.material_table_scale` -> `settings.scaling.components.material_table`
    - `settings.category_table_scale` -> `settings.scaling.components.category_table`
    - `settings.setting_page_scale` -> `settings.scaling.components.setting_page`
    - `settings.payment_modal_scale` -> `settings.scaling.components.payment_modal`

- [ ] **Step 3: Update Font Scales**
    - `settings.header_font_scale` -> `settings.scaling.fonts.header`
    - `settings.sidebar_font_scale` -> `settings.scaling.fonts.sidebar`
    - `settings.cart_font_scale` -> `settings.scaling.fonts.cart`
    - `settings.grid_font_scale` -> `settings.scaling.fonts.grid`
    - `settings.manage_table_font_scale` -> `settings.scaling.fonts.manage_table`
    - `settings.stock_table_font_scale` -> `settings.scaling.fonts.stock_table`
    - `settings.material_table_font_scale` -> `settings.scaling.fonts.material_table`
    - `settings.category_table_font_scale` -> `settings.scaling.fonts.category_table`
    - `settings.setting_page_font_scale` -> `settings.scaling.fonts.setting_page`
    - `settings.payment_modal_font_scale` -> `settings.scaling.fonts.payment_modal`
    - `settings.history_font_scale` -> `settings.scaling.fonts.history`

- [ ] **Step 4: Update complex dynamic access in design-mode components**
    - Update `MiniTuner.tsx`, `ComponentScaleControls.tsx`, `SelectableOverlay.tsx` where property names are used as keys.

### Task 3: Refactor Styling Settings

**Files:**
- `src/components/cart/Cart.tsx`
- `src/components/design-tuner/CartItemStylesPanel.tsx`
- `src/components/design-tuner/CartItemTuner.tsx`
- `src/components/design-tuner/SidebarTuner.tsx`
- `src/components/design-tuner/NumpadTuner.tsx`
- `src/components/design-tuner/GridTuner.tsx`
- `src/components/design-tuner/ButtonStylesPanel.tsx`
- `src/components/design-tuner/GlobalStylesPanel.tsx`
- `src/components/design-mode/GridItemSize.tsx`
- `src/components/design-mode/GlobalLayoutControls.tsx`
- `src/components/payment/CashInput.tsx`
- `src/components/payment/VirtualNumpad.tsx`

- [ ] **Step 1: Update Cart Styling**
    - `settings.cart_item_*` -> `settings.styling.cart.*`

- [ ] **Step 2: Update Payment/Numpad Styling**
    - `settings.payment_numpad_height` -> `settings.styling.payment.numpad_height`
    - `settings.numpad_*` -> `settings.styling.payment.*`

- [ ] **Step 3: Update Grid Styling**
    - `settings.grid_item_*` -> `settings.styling.grid.*`
    - `settings.grid_gap` -> `settings.styling.grid.gap`

- [ ] **Step 4: Update Sidebar Styling**
    - `settings.sidebar_icon_size` -> `settings.styling.sidebar.icon_size`
    - `settings.sidebar_item_spacing` -> `settings.styling.sidebar.item_spacing`
    - `settings.sidebar_item_radius` -> `settings.styling.sidebar.item_radius`
    - `settings.sidebar_active_bg_opacity` -> `settings.styling.sidebar.active_bg_opacity`

- [ ] **Step 5: Update Button Styling**
    - `settings.button_radius` -> `settings.styling.button.radius`
    - `settings.button_shadow_intensity` -> `settings.styling.button.shadow_intensity`
    - `settings.button_transition_speed` -> `settings.styling.button.transition_speed`

### Task 4: Refactor Typography and Theme Settings

**Files:**
- `src/components/design-tuner/TypographyTuner.tsx`
- `src/components/design-tuner/typography/TypographyControls.tsx`
- `src/components/design-tuner/GlobalStylesPanel.tsx`
- `src/components/design-tuner/ThemePresetsPanel.tsx`
- `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Update Typography**
    - `settings.typography_*` -> `settings.typography.*`

- [ ] **Step 2: Update Theme**
    - `settings.theme_primary_color` -> `settings.theme.theme_primary_color`
    - `settings.theme_radius` -> `settings.theme.theme_radius`
    - `settings.theme_preset` -> `settings.theme.theme_preset`

---

### Verification Strategy
- Run `npm run lint` to check for property access errors.
- Manual verification of the UI to ensure scales and styles are still applied correctly.
