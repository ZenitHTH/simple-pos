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
- Modify: `src/components/layout/BaseSidebarLayout.tsx`

- [x] **Step 1: Remove SelectableOverlay from Grid**
- [x] **Step 2: Remove SelectableOverlay from Sidebar**
- [x] **Step 3: Commit**

### Task 2: Create Grid Tuner

**Files:**
- Create: `src/components/design-tuner/GridTuner.tsx`

- [x] **Step 1: Create GridTuner.tsx**
- [x] **Step 2: Commit**

### Task 3: Create Sidebar Tuner

**Files:**
- Create: `src/components/design-tuner/SidebarTuner.tsx`

- [x] **Step 1: Create SidebarTuner.tsx**
- [x] **Step 2: Commit**

### Task 4: Integrate New Tuners into DesignTunerPage

**Files:**
- Modify: `src/components/design-tuner/TunerSidebar.tsx`
- Modify: `src/app/design/tuner/page.tsx`

- [x] **Step 1: Update TunerSidebar.tsx**
- [x] **Step 2: Update page.tsx**
- [x] **Step 3: Commit**

### Task 5: Restore Global Controls to BottomControlPanel

**Files:**
- Modify: `src/components/design-mode/BottomControlPanel.tsx`
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [x] **Step 1: Add Global Controls to BottomControlPanel.tsx**
- [x] **Step 2: Remove Page Width from MiniTuner.tsx**
- [x] **Step 3: Commit**

---

## Task 6: Upgrade SelectableOverlay (Post-Plan Optimization)

**Goal:** Resolve usability issues where single bottom-right handle is inaccessible at screen edges.

**Files:**
- Modify: `src/components/design-mode/SelectableOverlay.tsx`

- [x] **Step 1: Add 4-corner handles to SelectableOverlay**
- [x] **Step 2: Implement multi-directional drag logic**
- [x] **Step 3: Finalize Ghost Outline animation**
