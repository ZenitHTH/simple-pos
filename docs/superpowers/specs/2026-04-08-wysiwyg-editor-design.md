# On-Canvas Hybrid Editor Design Spec

**Date**: 2026-04-08
**Status**: Draft
**Topic**: Refinement of Design Mode with Direct Manipulation and Contextual Controls.

## 1. Overview
The Vibe POS WYSIWYG editor currently relies on a bottom fixed bar for all adjustments. To create a more professional and intuitive design experience, we are implementing a "Hybrid Editor" that allows users to resize components directly by dragging handles and perform precise tweaks via a floating, tabbed "Mini-Tuner".

## 2. Goals
- Provide immediate visual feedback during scaling (Direct Manipulation).
- Keep controls close to the point of interaction (Mini-Tuners).
- Maintain 1:1 scale for the editor interface itself (Portals).
- Support both mouse and touch input effectively.

## 3. Architecture

### 3.1 Components
- **SelectableOverlay (Updated)**: Acts as the interaction hub. It will now host the drag handles and trigger the `MiniTuner`.
- **DragHandle**: Small, circular handles positioned at the corners of the `SelectableOverlay`.
- **MiniTuner (New)**: A tabbed interface for precise settings.
    - Uses **React Portal** to render at the end of `<body>` to avoid parent `zoom` and `overflow: hidden`.
    - **Positioning**: Anchors to the top-right of the selected element's bounding box.
- **GhostOutline (New)**: A faint rectangle showing the original size of the component during a live drag session.

### 3.2 State Management
- Uses existing `SettingsContext` for persistent values.
- Uses `MockupContext` to track `selectedElementId`.
- **Internal Drag State**: Local component state in `SelectableOverlay` to track `isDragging` and `startPointerCoords`.

## 4. Interaction Model

### 4.1 Direct Manipulation (Drag to Scale)
1. **User interaction**: MouseDown/TouchStart on a corner handle.
2. **Logic**:
    - Record initial `display_scale` and pointer position.
    - On move: Calculate horizontal/vertical delta.
    - Map delta to percentage change (e.g., 10px drag = 1% scale change).
    - Call `updateSettings` in real-time.
3. **Visuals**: Component resizes instantly; a "Ghost Outline" stays at the 100% mark for reference.

### 4.2 Floating Mini-Tuner (Tabbed Controls)
- **Trigger**: Appears automatically when a component is selected.
- **Tabs**:
    - **Layout**: Scale slider, Padding controls.
    - **Style**: Font Scale, Icon Scale, Color pickers.
- **Precision**: Uses numeric inputs and range sliders for fine-tuning.

## 5. Testing Strategy
- **Unit Tests**: Verify the delta-to-scale calculation logic in a utility function.
- **E2E Tests (WDIO)**: 
    - Verify that clicking a component opens the `MiniTuner`.
    - Verify that dragging a handle actually updates the CSS `zoom` or `scale` of the target.
    - Verify that the `MiniTuner` is NOT itself scaled by the `AppShell` zoom.

## 6. Dependencies
- **Framer Motion**: (Optional but recommended) for spring physics during scaling transitions.
- **Lucide React**: (Existing) for icons in the Tuner.
