# Design Tuner Sidebar Refactor

## Objective
Resolve sidebar overflow in the Design Tuner by moving component-specific styling panels (Button Styles, Cart Item Styles) out of the sidebar and into dedicated "part pages" in the main preview area. This standardizes the tuning experience, ensures the sidebar remains purely for navigation and global settings, and separates "All Display" (layout/width) from "Component Detail" (font, padding, button scale) tuning.

## Key Principles
1. **Design Tuner (Detail Tuning):** Used for tweaking component internals (button scale, text size, padding) while looking at a dedicated preview.
2. **Design Mode (All Display Tuning):** Used for tweaking overall container sizes (Sidebar Width, Cart Width, Product Grid Scale) while looking at the full application.
3. **Sidebar Integrity:** Keep "Theme Presets" and "Global Appearance" in the sidebar but remove component detail panels to prevent overflow.

## Implementation Steps

### 1. Update TunerSidebar
- In `src/components/design-tuner/TunerSidebar.tsx`, add `"global"` to the `TunerTab` type.
- Add a `NavButton` for `"global"` (label: "Global & Theme", icon: `FaPalette`).
- Remove the `CartItemStylesPanel` and `ButtonStylesPanel` from the sidebar.
- Keep `ThemePresetsPanel` and `GlobalStylesPanel` at the bottom, but ensure the "Interactive tuning" message is shown for all component tabs.

### 2. Create GlobalTuner Page
- Create a dedicated landing page in the Tuner main area that houses the `ThemePresetsPanel` and `GlobalStylesPanel`. This allows for "Detail Tuning" of global styles on a large canvas.

### 3. Update Detail Tuner Pages
- **ButtonTuner**: Add `ButtonStylesPanel` sliders (Scale, Font Scale) directly into the preview layout.
- **CartItemTuner**: Add `CartItemStylesPanel` sliders (Font Sizes, Padding, Margin) directly into the preview layout.
- **SidebarTuner**: 
    - **Remove** the "Sidebar Width" slider (this is now exclusively tuned in Design Mode/MiniTuner).
    - **Add/Keep** "Font Size" and add a "Button Scale" slider to tune components inside the sidebar.

### 4. Update Main Tuner Page
- In `src/app/design/tuner/page.tsx`, set the default `activeTab` to `"global"`.
- Add logic to render the new `GlobalTuner` and pass necessary props to all component tuners.

### 5. Enhance On-Canvas MiniTuner
- **Sidebar Tuning**: Ensure clicking the sidebar in Design Mode allows adjusting `sidebar_scale` (Sidebar Width) via the MiniTuner.
- **Cart Tuning**: Ensure clicking the cart in Design Mode allows adjusting `cart_scale` (Cart Width) AND all the detail sliders for cart items.
- **Button Tuning**: Ensure clicking a button in Design Mode (e.g., the History button) allows adjusting `button_scale` and `button_font_scale`.

### 6. Enable On-Canvas Selection
- In `src/components/pos/POSHeader.tsx`, wrap the "History" button with a relative container and add `<SelectableOverlay id="button_scale" />` to make buttons selectable in Design Mode.

## Verification & Testing
1. Verify the Design Tuner sidebar no longer overflows.
2. Verify "Sidebar Width" is gone from the Tuner but available in Design Mode on the POS page.
3. Verify "Buttons" and "Cart Item" can be tuned in detail on their respective preview pages.
4. Verify "Global & Theme" settings are accessible both in the sidebar and on the main canvas.
