# Hybrid Editor Design Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate component-specific design controls into a draggable, persistent MiniTuner while streamlining the bottom bar into a centered global action island.

**Architecture:** 
1. **Draggable MiniTuner**: Enhance the `MiniTuner` with `framer-motion` dragging and screen-boundary detection. 
2. **Global Island**: Refactor `BottomControlPanel` into a centered pill UI focused on navigation and global scaling. 
3. **React Flow Safety**: Add auto-panning to `VolumeEdge` to ensure edge-of-screen controls are always reachable.

**Tech Stack:** React 19, Next.js 16, Framer Motion, Tailwind CSS 4, React Flow (@xyflow/react).

---

### Task 1: Draggable MiniTuner & Coordinate Persistence

**Files:**
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Add drag state and handle**
Update the `MiniTuner` to support manual dragging and remember coordinates across selections.

```tsx
// Inside MiniTuner component
const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);

// Update return JSX to include drag handle and props
<motion.div
  drag
  dragMomentum={false}
  onDragEnd={(_, info) => setDragOffset({ x: info.point.x, y: info.point.y })}
  // Apply dragOffset to style if it exists, otherwise use calculated position
  style={{ 
    top: dragOffset ? dragOffset.y : position.top, 
    left: dragOffset ? dragOffset.x : position.left 
  }}
>
  {/* Add a visible drag handle at the top */}
  <div className="h-1.5 w-12 bg-border/50 rounded-full mx-auto mb-2 cursor-grab active:cursor-grabbing" />
</motion.div>
```

- [ ] **Step 2: Implement screen boundary safety**
Ensure the tuner doesn't get dragged off-screen.

```tsx
<motion.div
  drag
  dragConstraints={{ left: 20, right: window.innerWidth - 300, top: 20, bottom: window.innerHeight - 400 }}
  // ... rest of props
/>
```

- [ ] **Step 3: Verify dragging behavior**
Manual verification: Open Design Mode, select an element, and drag the MiniTuner. Select a different element; the tuner should stay where you left it.

- [ ] **Step 4: Commit**
```bash
git add src/components/design-mode/MiniTuner.tsx
git commit -m "feat(design-mode): make MiniTuner draggable with position persistence"
```

### Task 2: Streamline BottomControlPanel into Global Island

**Files:**
- Modify: `src/components/design-mode/BottomControlPanel.tsx`

- [ ] **Step 1: Remove component-specific controls**
Strip `ComponentScaleControls` and theme color logic from the bottom bar as they are now in the MiniTuner/Sidebar.

- [ ] **Step 2: Center the UI as a floating island**
Update Tailwind classes to position the bar as a centered pill.

```tsx
// New container classes
<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-auto">
  <div className="bg-background/80 border-border/60 flex items-center gap-6 rounded-full border px-6 py-3 shadow-2xl backdrop-blur-xl">
    <NavigationMenu router={router} />
    <div className="bg-border h-8 w-px opacity-40" />
    <GlobalLayoutControls ... />
    <div className="bg-border h-8 w-px opacity-40" />
    <ActionButton ... label="Save Changes" />
  </div>
</div>
```

- [ ] **Step 3: Verify layout**
Manual verification: Ensure the bottom bar is no longer full-width and remains centered regardless of window size.

- [ ] **Step 4: Commit**
```bash
git add src/components/design-mode/BottomControlPanel.tsx
git commit -m "style(design-mode): refactor BottomControlPanel into centered floating island"
```

### Task 3: React Flow Edge Safety (VolumeEdge)

**Files:**
- Modify: `src/components/manage/recipe/VolumeEdge.tsx`

- [ ] **Step 1: Add pan-on-click logic**
Use `fitView` or `setCenter` when an edge label is clicked to ensure it's not clipped by screen edges.

```tsx
import { useReactFlow } from "@xyflow/react";

// Inside VolumeEdge component
const { setCenter } = useReactFlow();

const handleLabelClick = () => {
  // Smoothly center the view on this label's position
  setCenter(labelX, labelY, { duration: 800, zoom: 1.2 });
};

// Add to the label container
<div onClick={handleLabelClick} className="...">
```

- [ ] **Step 2: Verify edge safety**
Manual verification: Navigate to Recipe Builder, move an edge to the very corner of the canvas, and click the quantity label. The view should pan to center it.

- [ ] **Step 3: Commit**
```bash
git add src/components/manage/recipe/VolumeEdge.tsx
git commit -m "feat(recipe): add pan-on-click to VolumeEdge for edge-case accessibility"
```
