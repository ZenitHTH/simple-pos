# Objective
Fix the "cranky" dragging behavior of the `MiniTuner` component without adding new dependencies. The current issue is caused by a state conflict where a `requestAnimationFrame` loop constantly tries to pull the component back to its anchored position while Framer Motion is trying to drag it away.

# Key Files & Context
- `src/components/design-mode/MiniTuner.tsx`

# Implementation Steps
1.  **Track Detachment State:**
    -   Replace the `dragOffset` state with a `useRef<boolean>` called `isDetached`, initialized to `false`.
    -   When `selectedElementId` changes, reset `isDetached.current = false` so the tuner snaps to the new element.

2.  **Remove the Hot Loop:**
    -   Inside the `useEffect` that handles `updatePosition`, remove the `requestAnimationFrame(loop)` entirely.
    -   Add a check inside `updatePosition`: `if (isDetached.current) return;` so it stops auto-anchoring once the user drags the tuner.
    -   Instead of the loop, call `updatePosition` immediately, and perhaps once or twice with `setTimeout` (e.g., at 10ms and 150ms) to ensure it catches any layout shifts after render, along with the existing `scroll` and `resize` listeners.

3.  **Update Framer Motion Props:**
    -   Update the `style` prop of the `motion.div` to simply be `style={{ top: position.top, left: position.left }}`.
    -   Change `onDragEnd` to `onDragStart={() => { isDetached.current = true; }}`.
    -   Remove the hardcoded `y: 5` from `initial`, `animate`, and `exit` props on the `motion.div`, as this can cause a visual jump when combined with the dynamic `top` styling.
    -   Add `key={selectedElementId}` to the `motion.div`. This forces Framer Motion to completely reset its internal drag state and position whenever a new element is selected, preventing weird jumping behavior between selections.

# Verification & Testing
-   Open Design Mode and select an element; the MiniTuner should appear anchored to it.
-   Drag the MiniTuner; it should move smoothly without fighting or stuttering.
-   Scroll the page; if the MiniTuner has not been dragged, it should follow the element. If it *has* been dragged, it should remain where the user left it.
-   Select a *different* element; the MiniTuner should immediately snap to the new element's location.
-   Ensure no console errors or warnings related to Framer Motion or unmounted components.