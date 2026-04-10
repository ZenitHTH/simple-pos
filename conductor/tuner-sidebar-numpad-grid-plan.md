# Tuner Sidebar, Numpad, and Grid Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the Design Tuner sidebar with the main app sidebar sizing and add granular visual tuning for the Virtual Numpad and Product Grid components.

**Architecture:** 
1. Create a `BaseSidebarLayout` shared component to unify sidebar scaling.
2. Extend `AppSettings` with granular style properties for Numpad and Grid Items.
3. Update `MiniTuner` and sidebar panels to provide UI controls for these new settings.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 4, Framer Motion.

---

### Task 1: Update Settings Types and Defaults

**Files:**
- Modify: `src/lib/types/settings.ts`
- Modify: `src/context/settings/SettingsContext.tsx`

- [ ] **Step 1: Add new settings to AppSettings interface**

```typescript
// src/lib/types/settings.ts
export interface AppSettings {
  // ... existing ...
  numpad_scale: number;
  numpad_font_scale: number;
  numpad_display_font_scale: number;
  numpad_button_height: number | null;
  numpad_gap: number | null;

  grid_item_padding: number | null;
  grid_item_radius: number | null;
  grid_item_title_font_size: number | null;
  grid_item_price_font_size: number | null;
  grid_gap: number | null;
  // ... existing ...
}
```

- [ ] **Step 2: Add default values in SettingsContext**

```typescript
// src/context/settings/SettingsContext.tsx
const DEFAULT_SETTINGS: AppSettings = {
  // ... existing ...
  numpad_scale: 100,
  numpad_font_scale: 100,
  numpad_display_font_scale: 100,
  numpad_button_height: 80,
  numpad_gap: 12,

  grid_item_padding: 16,
  grid_item_radius: 24,
  grid_item_title_font_size: 100,
  grid_item_price_font_size: 100,
  grid_gap: 20,
  // ... existing ...
};
```

- [ ] **Step 3: Commit changes**

```bash
git add src/lib/types/settings.ts src/context/settings/SettingsContext.tsx
git commit -m "feat: add granular styling settings for numpad and product grid"
```

### Task 2: Create Shared BaseSidebarLayout

**Files:**
- Create: `src/components/layout/BaseSidebarLayout.tsx`

- [ ] **Step 1: Implement the BaseSidebarLayout component**

```tsx
"use client";

import { ReactNode } from "react";
import { IconType } from "react-icons";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib";
import GlobalHeader from "@/components/ui/GlobalHeader";

interface BaseSidebarLayoutProps {
  children: ReactNode;
  title: string;
  headerIcon?: IconType;
  isOpen?: boolean;
  onClose?: () => void;
  scale?: number;
  fontScale?: number;
  className?: string;
  side?: "left" | "right";
  showMobileClose?: boolean;
}

export default function BaseSidebarLayout({
  children,
  title,
  headerIcon,
  isOpen,
  onClose,
  scale = 100,
  fontScale = 100,
  className = "",
  side = "left",
  showMobileClose = true,
}: BaseSidebarLayoutProps) {
  // Calculate dynamic width (base 16rem = 256px)
  const baseWidth = 256;
  const dynamicWidth = `${baseWidth * (scale / 100)}px`;

  return (
    <aside
      style={{ width: dynamicWidth }}
      className={cn(
        "fixed inset-y-0 z-50 lg:static flex flex-col transition-all duration-300 ease-in-out",
        "bg-card text-card-foreground border-border border-r shadow-2xl lg:shadow-none",
        side === "left" ? "left-0" : "right-0 border-l border-r-0",
        isOpen ? "translate-x-0" : (side === "left" ? "-translate-x-full lg:translate-x-0" : "translate-x-full lg:translate-x-0"),
        className
      )}
    >
      <div
        style={{
          width: dynamicWidth,
          fontSize: `${fontScale}%`,
        }}
        className="group relative flex h-full flex-col"
      >
        <div className="flex items-center justify-between p-6 lg:block">
          <GlobalHeader
            title={title}
            icon={headerIcon}
            className="mb-0 px-0"
          />
          {showMobileClose && onClose && (
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground p-2 transition-colors lg:hidden"
            >
              <FaTimes size={24} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/BaseSidebarLayout.tsx
git commit -m "feat: add shared BaseSidebarLayout component"
```

### Task 3: Refactor Sidebars to use BaseSidebarLayout

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/design-tuner/TunerSidebar.tsx`

- [ ] **Step 1: Refactor main Sidebar.tsx**

```tsx
// src/components/layout/Sidebar.tsx
import BaseSidebarLayout from "./BaseSidebarLayout";
// ... remove duplicate styles/header logic ...

export default function Sidebar() {
  const { settings } = useSettings();
  const pathname = usePathname();
  // ... state logic ...

  if (pathname.startsWith("/design/tuner")) return null;

  return (
    <>
      {/* Mobile Header ... */}
      {/* Overlay ... */}
      <BaseSidebarLayout
        title="POS System"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scale={settings?.sidebar_scale}
        fontScale={settings?.sidebar_font_scale}
      >
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4" data-lenis-prevent>
          {/* ... menu entries mapping ... */}
        </nav>
        <div className="border-border mt-auto border-t p-4">
          <p className="text-muted text-center text-[0.75em]">© 2026 Simple POS</p>
        </div>
        <SelectableOverlay id="sidebar_scale" />
      </BaseSidebarLayout>
    </>
  );
}
```

- [ ] **Step 2: Refactor TunerSidebar.tsx**

```tsx
// src/components/design-tuner/TunerSidebar.tsx
import BaseSidebarLayout from "@/components/layout/BaseSidebarLayout";

export function TunerSidebar({ ...Props }) {
  return (
    <BaseSidebarLayout
      title="Design Tuner"
      headerIcon={FaPalette}
      scale={settings.sidebar_scale}
      fontScale={settings.sidebar_font_scale}
      className="backdrop-blur-xl bg-card/60"
    >
      <div className="mt-6 min-h-0 flex-1 space-y-8 overflow-y-auto pb-32 px-4 custom-scrollbar" data-lenis-prevent>
        {/* ... tuner content ... */}
      </div>
    </BaseSidebarLayout>
  );
}
```

- [ ] **Step 3: Verify and Commit**

```bash
git add src/components/layout/Sidebar.tsx src/components/design-tuner/TunerSidebar.tsx
git commit -m "refactor: unify sidebars using BaseSidebarLayout"
```

### Task 4: Enhance VirtualNumpad with Tuning

**Files:**
- Modify: `src/components/payment/VirtualNumpad.tsx`
- Modify: `src/components/design-tuner/NumpadTuner.tsx`

- [ ] **Step 1: Apply style settings to VirtualNumpad**

```tsx
// src/components/payment/VirtualNumpad.tsx
import { useSettings } from "@/context/settings/SettingsContext";

export default function VirtualNumpad(...) {
  const { settings } = useSettings();
  
  const gap = settings.numpad_gap ?? 12;
  const buttonHeight = settings.numpad_button_height ?? 80;
  const buttonFontSize = `${settings.numpad_font_scale ?? 100}%`;

  return (
    <div 
      className="grid grid-cols-4 select-none"
      style={{ 
        gap: `${gap}px`,
        fontSize: buttonFontSize 
      }}
    >
      {/* ... buttons ... */}
      <button 
        style={{ height: `${buttonHeight}px` }}
        className="..."
      >
        {key}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Add tuning controls to NumpadTuner**

```tsx
// src/components/design-tuner/NumpadTuner.tsx
// Add NumberSliders for: Gap, Button Height, Button Font Scale, Display Font Scale
```

- [ ] **Step 3: Commit**

```bash
git add src/components/payment/VirtualNumpad.tsx src/components/design-tuner/NumpadTuner.tsx
git commit -m "feat: add detailed tuning for Virtual Numpad"
```

### Task 5: Enhance Product Grid with Tuning

**Files:**
- Modify: `src/components/pos/ProductCard.tsx`
- Modify: `src/components/pos/POSProductGrid.tsx`
- Modify: `src/components/design-tuner/GridItemSize.tsx`

- [ ] **Step 1: Apply settings to ProductCard**

```tsx
// src/components/pos/ProductCard.tsx
// Apply padding, radius, and font sizes from settings
```

- [ ] **Step 2: Apply settings to POSProductGrid**

```tsx
// src/components/pos/POSProductGrid.tsx
// Apply grid_gap to the grid container
```

- [ ] **Step 3: Add controls to GridItemSize component**

```tsx
// src/components/design-mode/GridItemSize.tsx
// Add sliders for Padding, Radius, Title Font, Price Font, and Gap
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pos/ProductCard.tsx src/components/pos/POSProductGrid.tsx src/components/design-mode/GridItemSize.tsx
git commit -m "feat: add detailed tuning for Product Grid and Cards"
```

### Task 6: Final Integration in MiniTuner

**Files:**
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Add contextual sliders to MiniTuner**
  - When `grid_scale` is selected, show Grid Tuning sliders.
  - When `numpad_scale` is selected (new selectable ID), show Numpad Tuning sliders.

- [ ] **Step 2: Verify all tuning works live**

- [ ] **Step 3: Final Commit**

```bash
git add src/components/design-mode/MiniTuner.tsx
git commit -m "feat: integrate new grid and numpad tuning into MiniTuner"
```