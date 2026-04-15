# Objective
Migrate the `MiniTuner` component's drag-and-drop functionality to `react-draggable`. This replaces the custom, conflicting `requestAnimationFrame` and Framer Motion drag logic with a battle-tested open-source library, ensuring a smooth, performant, and maintainable long-term solution for floating windows in the POS design mode.

# Key Files & Context
- `src/components/design-mode/MiniTuner.tsx`
- `package.json`

# Implementation Steps

## 1. Dependency Installation
- Run `npm install react-draggable` to add the core library.
- Run `npm install -D @types/react-draggable` to add TypeScript definitions.

## 2. Refactor `MiniTuner.tsx` Drag Logic
- **Import:** Import `Draggable` from `react-draggable`.
- **Simplify State:** Remove the `dragOffset` state completely. We only need the calculated anchor `position` (top/left).
- **Remove Hot Loop:** Delete the `requestAnimationFrame` loop inside the `updatePosition` `useEffect`. The position should only be calculated once when a new `selectedElementId` is chosen (and optionally updated on window resize/scroll if the user hasn't started dragging).
- **Wrap with Draggable:** Wrap the main floating container (`motion.div`) with the `<Draggable>` component.
- **Configure Draggable:**
  - Set `handle=".drag-handle"` to restrict dragging to the top bar, preventing accidental drags when interacting with inputs/sliders inside the tuner.
  - Set `defaultPosition={{ x: position.left, y: position.top }}` so it starts at the calculated anchor point.
  - Add `key={selectedElementId}` to the `<Draggable>` component. This is crucial: it forces React to completely unmount and remount the Draggable component whenever a new element is selected on the canvas, snapping it perfectly to the new anchor position and resetting its internal drag state.
- **Clean up Framer Motion:** Remove all drag-related props (`drag`, `dragMomentum`, `dragConstraints`, `onDragEnd`) from the `motion.div`. Keep only the entry/exit animations (`initial`, `animate`, `exit`).

## 3. UI Refinements
- Add the `drag-handle` class to the small pill/bar at the top of the `MiniTuner` component.
- Ensure the `drag-handle` has appropriate cursor styling (`cursor-grab`, `active:cursor-grabbing`).

# Verification & Testing
- Start the development server and enter Design Mode.
- Select an element on the canvas; the MiniTuner should appear anchored to it.
- Click and drag the top handle of the MiniTuner. It should move smoothly without any stuttering or fighting.
- Attempt to click and drag from inside the tuner (e.g., on a blank space or a slider). It should *not* drag, allowing normal interaction with the UI controls.
- Select a different element on the canvas. The MiniTuner should instantly snap to the new anchor position.