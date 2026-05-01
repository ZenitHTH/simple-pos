# Design: Tuner Sidebar, Numpad, and Product Grid Tuning

## 1. Shared Sidebar Layout (Option B)
**Goal:** Ensure `TunerSidebar` perfectly matches the main `Sidebar` in sizing and behavior, including respecting the global `sidebar_scale`.

*   **Action:** Create a new `BaseSidebarLayout.tsx` component in `src/components/layout/`.
*   **Props:** `children`, `title`, `headerIcon`, `isOpen`, `onClose`, `scale` (defaults to `settings.sidebar_scale`), and `fontScale`.
*   **Refactor:** Update both `Sidebar.tsx` and `TunerSidebar.tsx` to wrap their specific navigation/tuner content inside `<BaseSidebarLayout>`. 
*   **Result:** The Design Tuner sidebar will now dynamically scale to match the exact dimensions of your actual app sidebar.

## 2. Detailed Virtual Numpad Tuning
**Goal:** Allow granular control over the Numpad's appearance in Design Mode.

*   **New AppSettings:**
    *   `numpad_scale` (Overall size)
    *   `numpad_font_scale` (Base font size for buttons)
    *   `numpad_display_font_scale` (Font size for the numbers typed at the top)
    *   `numpad_button_height` (Height of individual number keys)
    *   `numpad_gap` (Spacing between buttons)
*   **Implementation:** 
    *   Update `VirtualNumpad.tsx` to accept these styles via inline styles or CSS variables.
    *   Add a `<SelectableOverlay id="numpad_scale" />` to the numpad wrapper in the Payment Modal.
    *   Add precision sliders to `MiniTuner.tsx` and the `NumpadTuner.tsx` panel to adjust these values in real-time.

## 3. Detailed Product Grid Tuning
**Goal:** Expand grid tuning beyond just `grid_scale` to match the granular control you have over Cart Items.

*   **New AppSettings:**
    *   `grid_item_padding` (Inner padding of product cards)
    *   `grid_item_radius` (Border radius of product cards)
    *   `grid_item_title_font_size` (Size of product name)
    *   `grid_item_price_font_size` (Size of product price)
    *   `grid_gap` (Spacing between grid items in `POSProductGrid`)
*   **Implementation:**
    *   Update `ProductCard.tsx` to apply these settings.
    *   Update `POSProductGrid.tsx` to apply the `grid_gap`.
    *   Add controls to `MiniTuner.tsx` (when `grid_scale` is selected) and the `GridItemSize` panel in the tuner sidebar.