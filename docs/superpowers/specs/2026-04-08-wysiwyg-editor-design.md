# On-Canvas Hybrid Editor Design Spec

**Date**: 2026-04-08
**Status**: Approved
**Topic**: Refinement of Design Mode with Direct Manipulation and Contextual Controls.

## 1. Overview
The Vibe POS WYSIWYG editor is transitioning from a fixed bottom control bar to a "Hybrid Editor" system. This system allows users to resize components directly via corner drag handles and perform precise adjustments through a floating, tabbed "MiniTuner" that anchors to the selected element.

## 2. Goals
- **Immediate Feedback**: Provide real-time visual scaling during drag operations.
- **Contextual Proximity**: Keep controls close to the point of interaction to minimize eye and hand movement.
- **Visual Reference**: Provide a "Ghost Outline" showing the 100% scale mark during modification.
- **Scale Independence**: Ensure the editor UI itself remains at 100% scale regardless of the component's zoom level.

## 3. Architecture

### 3.1 Components
- **SelectableOverlay (Enhanced)**: 
    - Hosts four circular **Drag Handles** at its corners.
    - Manages local drag state (`isDragging`, `dragDelta`) to trigger real-time updates.
- **MiniTuner (New)**:
    - **Portal-based**: Renders via React Portal at the `<body>` level to stay at 1:1 scale (100%).
    - **Smart Positioning**: Uses `getBoundingClientRect()` to anchor to the selected element.
    - **Smart Flipping**: Automatically flips its anchor position (Top-Right, Bottom-Left, etc.) if it detects it will be cut off by the screen boundary.
    - **Glassmorphism UI**: Uses a blurred, translucent background for a premium feel.
- **GhostOutline (New)**: A dashed rectangle that appears behind the element during a drag, locked at the original 100% size for spatial context.

### 3.2 State Management
- **SettingsContext**: Continues to store persistent values (e.g., `sidebar_scale`, `cart_scale`).
- **MockupContext**: Tracks the `selectedElementId` to determine which component is being edited.

## 4. Interaction Model

### 4.1 Direct Manipulation (Drag to Scale)
1. **Trigger**: MouseDown/TouchStart on any corner handle of a `SelectableOverlay`.
2. **Action**: Dragging moves the handle; the distance is mapped to a percentage change (approx. 5px = 1% scale).
3. **Update**: `updateSettings` is called in real-time, causing the component to resize immediately.
4. **Visuals**: A "Ghost Outline" shows the original 100% size.

### 4.2 Floating MiniTuner (Tabbed Controls)
- **Tabs**:
    - **Layout 📐**: Sliders for **Component Scale** (50%–200%) and **Inner Padding** (0px–40px).
    - **Style ✨**: Sliders for **Font Scale** (80%–150%) and **Icon Scale** (80%–150%), plus a **Primary Color Grid** for theme selection.
- **Precision**: Uses range sliders with numeric value displays for fine-tuning.

## 5. Implementation Roadmap
- [ ] Update `SelectableOverlay` with `framer-motion` handles and drag logic.
- [ ] Implement `MiniTuner` portal component with "Smart Flipping" logic.
- [ ] Add Layout and Style tabs to `MiniTuner`.
- [ ] Integrate real-time `SettingsContext` updates for all controls.

## 6. Testing Strategy
- **Visual Regression**: Ensure `MiniTuner` remains sharp (100% scale) when components are zoomed.
- **Boundary Testing**: Verify that `MiniTuner` flips correctly at all four screen corners.
- **Touch Validation**: Ensure drag handles are large enough (hit area) and responsive on touch devices.
- **Performance**: Monitor frame rates during real-time scaling updates to ensure no lag on mid-range hardware.
