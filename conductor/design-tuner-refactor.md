# Design Tuner Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the `src/components/design-tuner` directory into logical subfolders (`tuners`, `panels`, `core`, `ui`) for easier human searching and consolidate redundant slider components (`SidebarSlider`, `TypographySlider`) into a single `TunerSlider` that utilizes the global `@/components/ui/RangeSlider`.

**Architecture:** We will create a hierarchical folder structure. Generic UI elements specific to the tuner will go into `ui/`. Control panels will go into `panels/`. Main workspace views will go into `tuners/`. Core layout elements will go into `core/`. We will replace custom slider implementations with a unified component that wraps the global `RangeSlider`.

**Tech Stack:** React 19, Tailwind CSS 4, Next.js App Router.

---

### Task 1: Create TunerSlider Component

**Files:**
- Create: `src/components/design-tuner/ui/TunerSlider.tsx`
- Delete: `src/components/design-tuner/SidebarSlider.tsx`
- Delete: `src/components/design-tuner/TypographySlider.tsx`

- [ ] **Step 1: Create the new TunerSlider component**

```tsx
// src/components/design-tuner/ui/TunerSlider.tsx
"use client";

import RangeSlider from "@/components/ui/RangeSlider";
import { cn } from "@/lib";

interface TunerSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
  variant?: "default" | "compact"; // To handle slight visual differences if needed, default covers both
}

export function TunerSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  formatDisplay,
  variant = "default",
}: TunerSliderProps) {
  const display = formatDisplay
    ? formatDisplay(value)
    : `${value}${unit}`;

  return (
    <div className={cn("space-y-1.5", variant === "compact" && "py-1")}>
      <div className="flex items-center justify-between px-1">
        <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.1em]">
          {label}
        </label>
        <span className="text-primary bg-primary/10 rounded px-2 py-1 text-[10px] font-mono font-black border border-primary/20">
          {display}
        </span>
      </div>
      <div className="flex items-center h-8">
        <RangeSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/ui/TunerSlider.tsx
git commit -m "refactor(theme): create unified TunerSlider using global RangeSlider"
```

---

### Task 2: Reorganize Directory Structure

**Files:**
- Move all files in `src/components/design-tuner/` to subfolders.

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/components/design-tuner/tuners
mkdir -p src/components/design-tuner/panels
mkdir -p src/components/design-tuner/core
mkdir -p src/components/design-tuner/previews
```

- [ ] **Step 2: Move files**

```bash
mv src/components/design-tuner/*Tuner.tsx src/components/design-tuner/tuners/ 2>/dev/null || true
mv src/components/design-tuner/*Panel.tsx src/components/design-tuner/panels/ 2>/dev/null || true
mv src/components/design-tuner/TunerSidebar.tsx src/components/design-tuner/ThemeExplorerModal.tsx src/components/design-tuner/core/ 2>/dev/null || true
mv src/components/design-tuner/ThemeCard.tsx src/components/design-tuner/TypographyPreview.tsx src/components/design-tuner/previews/ 2>/dev/null || true
mv src/components/design-tuner/NavButton.tsx src/components/design-tuner/ui/ 2>/dev/null || true
rm src/components/design-tuner/SidebarSlider.tsx src/components/design-tuner/TypographySlider.tsx 2>/dev/null || true
```

- [ ] **Step 3: Commit**

```bash
git add src/components/design-tuner/
git commit -m "refactor(theme): reorganize design-tuner files into subdirectories"
```

---

### Task 3: Update Imports in Panels

**Files:**
- Modify: `src/components/design-tuner/panels/*.tsx`

- [ ] **Step 1: Replace SidebarSlider and TypographySlider with TunerSlider**

For every panel file (e.g., `GlobalStylesPanel.tsx`, `GridStylesPanel.tsx`, etc.), update the imports and component usage:

Example `sed` or manual replacement (applied to all panels):
Change:
```tsx
import { SidebarSlider } from "./SidebarSlider";
// OR
import { TypographySlider } from "./TypographySlider";
```
To:
```tsx
import { TunerSlider } from "../ui/TunerSlider";
```

Change component tags from `<SidebarSlider` or `<TypographySlider` to `<TunerSlider`.

Update relative imports for modals/previews if necessary (e.g., in `ThemePresetsPanel.tsx`, no changes needed if everything is in panels, but `GlobalStylesPanel` imports `ThemeExplorerModal` - update to `../core/ThemeExplorerModal`).

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/panels/
git commit -m "refactor(theme): update panels to use TunerSlider and new paths"
```

---

### Task 4: Update Imports in Tuners and Core

**Files:**
- Modify: `src/components/design-tuner/tuners/*.tsx`
- Modify: `src/components/design-tuner/core/*.tsx`

- [ ] **Step 1: Update Tuner component imports**

For every tuner file, update imports for panels and core components.
Example:
Change: `import { GlobalStylesPanel } from "./GlobalStylesPanel";`
To: `import { GlobalStylesPanel } from "../panels/GlobalStylesPanel";`

Change: `import { ThemePresetsPanel } from "./ThemePresetsPanel";`
To: `import { ThemePresetsPanel } from "../panels/ThemePresetsPanel";`

- [ ] **Step 2: Update Core component imports**

In `TunerSidebar.tsx`:
Update `NavButton` import to `../ui/NavButton`.

In `ThemeExplorerModal.tsx`:
Update `ThemeCard` import to `../previews/ThemeCard`.

- [ ] **Step 3: Commit**

```bash
git add src/components/design-tuner/tuners/ src/components/design-tuner/core/
git commit -m "refactor(theme): update import paths in tuners and core components"
```

---

### Task 5: Update External Consumers

**Files:**
- Modify: `src/components/design-mode/MiniTuner.tsx`
- Modify: `src/components/design-mode/ComponentScaleControls.tsx`
- Modify: `src/app/design/tuner/page.tsx`

- [ ] **Step 1: Update MiniTuner and ComponentScaleControls**

In `MiniTuner.tsx`:
Change `import { GridStylesPanel } from "../design-tuner/GridStylesPanel";`
To `import { GridStylesPanel } from "../design-tuner/panels/GridStylesPanel";`

Change `import { SidebarSlider } from "../design-tuner/SidebarSlider";`
To `import { TunerSlider } from "../design-tuner/ui/TunerSlider";`
(And update `<SidebarSlider` to `<TunerSlider`)

In `ComponentScaleControls.tsx`:
Update `GridStylesPanel` import similarly.

- [ ] **Step 2: Update Main Page**

In `src/app/design/tuner/page.tsx`:
Update imports for all Tuners to point to `../components/design-tuner/tuners/X`.
Update `TunerSidebar` import to `../components/design-tuner/core/TunerSidebar`.

- [ ] **Step 3: Commit**

```bash
git add src/components/design-mode/ src/app/design/tuner/page.tsx
git commit -m "refactor(theme): update external consumers to use new design-tuner structure"
```
