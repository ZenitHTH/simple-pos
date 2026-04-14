# Theme Library and Palette Generator Design Spec

**Date**: 2026-04-12
**Status**: Draft
**Topic**: Curated Themes Library & Dynamic Palette Generation

## 1. Overview
Vibe POS will introduce a "Theme Library" feature to provide a premium, Chrome-like customization experience. It leverages the existing zero-JS `color-mix(in oklch)` infrastructure to dynamically generate complete light and dark themes from a few curated base colors.

## 2. Goals
- **Primary:** Provide a "Curated Themes Library" where users can browse and apply pre-designed, high-quality color palettes with a single click.
- **Secondary:** Provide an "Advanced Palette Generator" allowing users to define a custom primary color and have the system dynamically generate matching shades.

## 3. Architecture & Data Flow
- **Data Model:** We will expand the `THEME_PRESETS` in `src/context/settings/constants.ts` to include a robust set of dynamic themes (e.g., "Ocean", "Matcha", "Sunset").
- **Dynamic Generation:** Instead of hardcoding every variant (Background, Card, Text, Border), the curated presets will define a base `--theme-primary` color and rely on the `globals.css` and `tokens.css` `color-mix` rules to automatically generate the hover, active, muted, and glow states.
- **State Management:** The selected theme is saved to `AppSettings.theme`. `SettingsContext` applies these via CSS custom properties.

## 4. UI/UX Design
**The "Theme Explorer" Modal**
To provide an immersive browsing experience without cluttering the sidebar, we will build a Full Page Modal (Overlay) accessible from the Design Tuner.

- **Trigger:** A prominent "Explore Themes" button in the `GlobalStylesPanel.tsx` (replacing or augmenting the current simple color pickers).
- **Layout:**
  - **Header:** Title, Close Button, and a Light/Dark mode toggle (to preview how themes look in both modes).
  - **Body (Grid):** A visual grid of large "Theme Cards". Each card displays a stylized mini-preview of the POS (e.g., a mock sidebar, product card, and button) rendered in that theme's colors.
  - **Custom Color Section:** A dedicated area below or alongside the curated grid where users can input a custom HEX code to generate their own palette.
- **Interaction:** Clicking a Theme Card instantly applies the CSS variables to the document `:root`, providing a live, zero-latency preview on the actual POS canvas beneath the modal.

## 5. Implementation Steps
1. **Define Curated Themes:** Expand `THEME_PRESETS` in `constants.ts` with 4-6 diverse base color palettes.
2. **Build Theme Explorer UI:** Create a new component `ThemeExplorerModal.tsx` containing the grid of theme cards and the custom color picker.
3. **Integrate with Tuner:** Update `GlobalStylesPanel.tsx` to include the "Explore Themes" trigger button.
4. **Refine CSS:** Ensure the fallback logic in `tokens.css` gracefully handles switching between curated presets (which might only set `--theme-primary`) and advanced custom themes (which might override `--theme-background`, `--theme-card`, etc.).

## 6. Testing Strategy
- **Visual Regression:** Verify that `color-mix` generates accessible contrast ratios for text on primary buttons across all curated themes.
- **State Persistence:** Ensure that selecting a theme from the modal correctly saves the configuration to the backend via `settingsApi.saveSettings()`.
- **Mode Switching:** Verify themes render correctly when the user toggles between system Light and Dark modes.