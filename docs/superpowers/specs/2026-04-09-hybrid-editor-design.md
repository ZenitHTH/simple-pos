# Spec: Hybrid Editor Design Mode

**Date:** 2026-04-09
**Status:** Approved

## 1. Objective
Consolidate the "Design Mode" (Mockup Mode) UI by moving component-specific tuning to a mobile, draggable `MiniTuner` and keeping global application controls in a centered, floating `BottomControlPanel`.

## 2. Global Action Bar (BottomControlPanel)
- **Position:** `fixed bottom-8 left-1/2 -translate-x-1/2`.
- **UI:** Floating pill-shaped island.
- **Scope:**
    - Navigation (Switching pages)
    - Global Display Scaling (75%-125%)
    - Global Layout Splits (Dual Column ratio)
    - Primary Save/Discard actions

## 3. Draggable MiniTuner
- **Position:** Initially follows selection, but becomes draggable via a handle.
- **Persistence:** Remembers its dragged position until the session ends.
- **Scope:**
    - Component Scale (Sidebar, Cart, Grid, etc.)
    - Component Padding/Margin
    - Font Scaling for that specific component
    - Color Sampling (where applicable)

## 4. Edge-Case Safety
- **React Flow (`VolumeEdge.tsx`):** Implement "Pan on Click" for elements at the screen edge to ensure inputs remain accessible.
- **MiniTuner:** Flip/Shift logic to stay within a 20px screen margin.

## 5. Verification Plan
- [ ] MiniTuner can be dragged and stays in place.
- [ ] Bottom bar remains centered and contains only Global/Nav controls.
- [ ] React Flow edges sitting at the very bottom/side are brought into view when clicked.
