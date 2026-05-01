# Design Spec: Flat UI Colors v2 Integration

**Date**: 2026-05-01
**Status**: Draft
**Topic**: High-contrast theme system using Chinese (Light) and Swedish (Dark) palettes.

## 1. Overview
The goal of this design is to evolve the Vibe POS aesthetic from generic "white/black" modes into a sophisticated, high-contrast design system driven by the **Flat UI Colors v2** collection. We will use the **Chinese (CN)** palette for Light Mode and the **Swedish (SE)** palette for Dark Mode, ensuring that no "Pure White" (#FFFFFF) or "Pure Black" (#000000) is used in the base layers to improve visual comfort and premium feel.

## 2. Technical Color Mapping

| System Role | **Light Mode** (Chinese 🇨🇳) | **Dark Mode** (Swedish 🇸🇪) |
| :--- | :--- | :--- |
| **Main Background** | `#ced6e0` (Anti-Flash White) | `#1e272e` (Black Pearl) |
| **Surface (Cards/Modals)** | `#dfe4ea` (City Lights) | `#485460` (Good Night!) |
| **Highlight/Borders** | `#f1f2f6` (Pumpkin Patch) | `#808e9b` (London Square) |
| **Default Text** | `#2f3542` (Prestige Blue) | `#d2dae2` (Hint of Elusive Blue) |
| **Primary (Default)** | `#5352ed` (Saturated Sky) | `#575fcf` (Dark Periwinkle) |
| **Success** | `#2ed573` (Ufo Green) | `#05c46b` (Green Teal) |
| **Warning** | `#ffa502` (Orange) | `#ffa801` (Chrome Yellow) |
| **Danger** | `#ff4757` (Watermelon) | `#ff3f34` (Red Orange) |

## 3. UI Enhancements: Global Styles Panel
To help users stay "on-brand" with the new palettes, we will enhance the `GlobalStylesPanel.tsx`:

### 3.1. Palette Quick-Select
- Add a horizontal scrolling list of colors from the respective active palette (CN for Light, SE for Dark) under the Primary Color picker.
- This allows users to quickly swap the "Identity" color without leaving the Flat UI aesthetic.

### 3.2. Responsive Overrides
- When a user chooses to reset a specific color (Background, Card, etc.), it will now fall back to the **Flat UI defaults** defined in the table above, rather than pure white/black.

## 4. Implementation Strategy

### 4.1. CSS Variables (`src/app/styles/tokens.css`)
We will update the `:root` and `.dark` selectors to hardcode these hex values as the system's "Baseline Fallbacks". This ensures a consistent look even during the initial load or when JS-driven settings are being hydrated.

### 4.2. Global Settings (`src/context/settings/constants.ts`)
- Update `DEFAULT_SETTINGS` to match the new palette roles.
- Update `CURATED_THEMES` to include specialized CN/SE entries.

### 4.3. Accessibility
- We will continue to use the **OKLCH** perceptual contrast logic in CSS to ensure that any custom color selected by the user automatically generates accessible foreground text.

## 5. Success Criteria
- [ ] No Pure White (#FFFFFF) visible in Light Mode base layers.
- [ ] No Pure Black (#000000) visible in Dark Mode base layers.
- [ ] Global Styles Panel offers quick-select swatches from the CN/SE palettes.
- [ ] All system roles (Success, Warning, Danger) match the Flat UI palette character.
