# Tuner Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Grid and Sidebar tuning from the live canvas into dedicated, controlled preview environments in the Design Tuner, and restore global Display Scale and Page Width controls to the BottomControlPanel.

**Architecture:** We are removing the on-canvas `SelectableOverlay` components for structural layouts (Grid and Sidebar) because dragging them fights with the browser's layout engine and feels "crunchy". Instead, we are creating dedicated tuning tabs (`GridTuner` and `SidebarTuner`) with safe, isolated "mini layouts" for previewing changes. We are also returning true global controls back to the floating `BottomControlPanel`.

**Tech Stack:** React, Next.js, Tailwind CSS, Framer Motion

---

### Task 1: Clean up Live Canvas Overlays

**Files:**
- Modify: `src/components/pos/POSProductGrid.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Remove SelectableOverlay from Grid**
In `src/components/pos/POSProductGrid.tsx`, remove the import for `SelectableOverlay` and remove `<SelectableOverlay id="grid_scale" />` from the JSX.

- [ ] **Step 2: Remove SelectableOverlay from Sidebar**
In `src/components/layout/Sidebar.tsx`, remove the import for `SelectableOverlay` and remove `<SelectableOverlay id="sidebar_scale" />` from the JSX.

- [ ] **Step 3: Commit**
```bash
git add src/components/pos/POSProductGrid.tsx src/components/layout/Sidebar.tsx
git commit -m "refactor(design-mode): remove on-canvas scaling overlays for structural layouts"
```

### Task 2: Create Grid Tuner

**Files:**
- Create: `src/components/design-tuner/GridTuner.tsx`

- [ ] **Step 1: Create GridTuner.tsx**
Create a new component that provides a mini-layout preview of the grid and includes the `GridItemSize` controls and a slider for `grid_gap`. It should use `framer-motion` for transitions.

- [ ] **Step 2: Commit**
```bash
git add src/components/design-tuner/GridTuner.tsx
git commit -m "feat(design-mode): add dedicated Grid Tuner with mini-layout preview"
```

### Task 3: Create Sidebar Tuner

**Files:**
- Create: `src/components/design-tuner/SidebarTuner.tsx`

- [ ] **Step 1: Create SidebarTuner.tsx**
Create a new component that renders a mock `BaseSidebarLayout` next to a mock content area. Include `SidebarSlider` components for `sidebar_scale` and `sidebar_font_scale`.

- [ ] **Step 2: Commit**
```bash
git add src/components/design-tuner/SidebarTuner.tsx
git commit -m "feat(design-mode): add dedicated Sidebar Tuner with contextual preview"
```

### Task 4: Integrate New Tuners into DesignTunerPage

**Files:**
- Modify: `src/components/design-tuner/TunerSidebar.tsx`
- Modify: `src/app/design/tuner/page.tsx`

- [ ] **Step 1: Update TunerSidebar.tsx**
Add a "Sidebar" tab to the `TunerTab` type and the navigation menu using the `FaColumns` icon.

- [ ] **Step 2: Update page.tsx**
Import `GridTuner` and `SidebarTuner`. Replace the inline Grid tuning section with the `<GridTuner />` component, and add the conditional render for `<SidebarTuner />`.

- [ ] **Step 3: Commit**
```bash
git add src/components/design-tuner/TunerSidebar.tsx src/app/design/tuner/page.tsx
git commit -m "feat(design-mode): integrate Grid and Sidebar tuners into Design Tuner"
```

### Task 5: Restore Global Controls to BottomControlPanel

**Files:**
- Modify: `src/components/design-mode/BottomControlPanel.tsx`
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Add Global Controls to BottomControlPanel.tsx**
Import `NumberStepper` or `NumberSlider`. Add sliders for `Display Scale` (`display_scale`) and `Page Width` (`layout_max_width`) directly into the `BottomControlPanel` flex container, ensuring they only show when `isMockupMode` is true.

- [ ] **Step 2: Remove Page Width from MiniTuner.tsx**
Remove the `layout_max_width` tuning section from `MiniTuner.tsx` since it now lives in the global bar.

- [ ] **Step 3: Commit**
```bash
git add src/components/design-mode/BottomControlPanel.tsx src/components/design-mode/MiniTuner.tsx
git commit -m "refactor(design-mode): restore Display Scale and Page Width to global control panel"
```

---

### Fallback Plan: Revert Sidebar Tuner

If you decide the dedicated Sidebar Tuner doesn't feel right, you can easily revert back to on-canvas tuning using this fallback plan.

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/app/design/tuner/page.tsx`
- Modify: `src/components/design-tuner/TunerSidebar.tsx`
- Delete: `src/components/design-tuner/SidebarTuner.tsx`

- [ ] **Step 1: Restore SelectableOverlay to Sidebar**
In `src/components/layout/Sidebar.tsx`, re-import `SelectableOverlay` and place `<SelectableOverlay id="sidebar_scale" />` back inside the `BaseSidebarLayout` component, exactly where it was before.

- [ ] **Step 2: Remove Sidebar Tuner references**
In `src/app/design/tuner/page.tsx`, remove the `<SidebarTuner />` import and its conditional rendering block. In `src/components/design-tuner/TunerSidebar.tsx`, remove the "Sidebar" tab from the navigation list and the `TunerTab` type. Finally, delete the `src/components/design-tuner/SidebarTuner.tsx` file.

- [ ] **Step 3: Commit**
```bash
git rm src/components/design-tuner/SidebarTuner.tsx
git add src/components/layout/Sidebar.tsx src/app/design/tuner/page.tsx src/components/design-tuner/TunerSidebar.tsx
git commit -m "revert(design-mode): undo dedicated Sidebar Tuner and restore on-canvas overlay"
```
