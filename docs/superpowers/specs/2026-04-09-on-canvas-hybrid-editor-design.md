# On-Canvas Hybrid Editor Design Spec (Refined)

**Date**: 2026-04-09
**Status**: Draft
**Topic**: Implementation of On-Canvas Direct Manipulation, Floating MiniTuner, and Color Sampler.

## 1. Overview
The Vibe POS WYSIWYG editor is evolving into a "Hybrid Editor" system. This system allows users to resize components directly via corner drag handles and perform precise adjustments through a floating, tabbed "MiniTuner" that anchors to the selected element. It also introduces a "Color Sampler" to extract theme colors directly from product images.

## 2. Goals
- **Immediate Feedback**: Provide real-time visual scaling and color previewing during operations.
- **Contextual Proximity**: Keep controls (MiniTuner) anchored to the selected element to minimize eye movement.
- **UI Isolation**: Ensure the editor UI (handles, menu) remains at 1:1 scale (100%) regardless of the component's zoom level.
- **Visual Reference**: Use a "Ghost Outline" to maintain spatial context during resizing.
- **Safety**: Implement an "Explicit Apply" mechanism for color sampling to prevent accidental theme changes.

## 3. Architecture

### 3.1 UI Isolation Layer (Portal)
- **MiniTuner**: Renders via a React Portal at the `<body>` level. This prevents the menu from being scaled, clipped, or blurred by the component's parent containers.
- **Drag Handles**: Attached to the `SelectableOverlay` but managed via `framer-motion` to ensure they remain interactive and sharp.

### 3.2 State Management
- **SettingsContext**: The source of truth for persistent UI scales (`sidebar_scale`, `cart_scale`, etc.) and theme colors.
- **MockupContext**: Tracks the `selectedElementId` and temporary preview states (e.g., `previewColor`).
- **Interaction Flow**: 
    1. User interacts (Drag/Click).
    2. Local state updates for real-time feedback (scaling/previewing).
    3. On release (Drag) or "Apply" (Color), `updateSettings` is called to persist the change.

## 4. Interaction Model

### 4.1 Direct Manipulation (Drag to Scale)
- **Handles**: Four circular handles at the corners of the `SelectableOverlay`.
- **Logic**: Dragging maps mouse delta to percentage change (approx. 5px = 1%).
- **Ghost Outline**: A dashed rectangle showing the original 100% size appears during the drag operation.
- **MiniTuner Visibility**: The MiniTuner stays anchored and follows the component's top-right corner in real-time as it resizes.

### 4.2 Floating MiniTuner (Contextual Menu)
- **Tabs**:
    - **Layout 📐**: Precision sliders for **Component Scale** (50%–200%), **Inner Padding**, and **Outer Margins**.
    - **Style ✨**: Sliders for **Font Scale** and **Icon Scale**, plus the **Color Sampler Swatches**.
- **Smart Positioning**: Uses `getBoundingClientRect()` to anchor to the Top-Right of the selection.
- **Smart Flipping**: Automatically flips its anchor position (e.g., to Bottom-Left) if it would be cut off by screen boundaries.

### 4.3 Color Sampler
- **Extraction**: Uses a hidden `<canvas>` to extract the top 3 dominant colors from the product card's `<img>`.
- **Swatches**: Displayed in the "Style" tab of the MiniTuner.
- **Application Logic**:
    - **Click Swatch**: Updates the component's preview color instantly (Visual Feedback).
    - **Apply Button**: Confirms and persists the color to the global theme.
    - **Revert**: Deselecting or closing the menu without applying reverts to the original theme color.

## 5. Implementation Roadmap
- [ ] **Phase 1: UI Isolation**: Move `MiniTuner` to a Portal and implement "Smart Flipping" logic.
- [ ] **Phase 2: Direct Manipulation**: Add Corner Handles to `SelectableOverlay` with `framer-motion` drag logic and "Ghost Outline".
- [ ] **Phase 3: MiniTuner Tabs**: Implement Layout and Style tabs with precision sliders.
- [ ] **Phase 4: Color Sampler**: Implement canvas-based color extraction and the "Explicit Apply" workflow.

## 6. Testing & Validation
- **Scale Fidelity**: Verify that the MiniTuner and Drag Handles remain at 100% scale even when the element is zoomed to 200%.
- **Boundary Checks**: Test MiniTuner flipping at all four screen corners.
- **Performance**: Ensure 60fps during real-time drag-to-scale operations.
- **Color Logic**: Confirm that closing the menu without clicking "Apply" reverts the previewed color.
