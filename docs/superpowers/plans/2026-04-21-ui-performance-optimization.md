# UI Performance & Theme Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve scrolling lag and graphical glitches by transitioning from CPU-bound CSS (zoom, all-property transitions) to GPU-accelerated standard patterns (transform, targeted transitions) and fixing hardcoded theme inconsistencies in the Design Tuner.

**Architecture:** 
- **Scaling**: Replace non-standard `zoom` with hardware-accelerated `transform: scale()` in `AppShell` and the Design Tuner canvas.
- **Animations**: Refactor broad `transition: all` declarations into targeted property animations to prevent layout thrashing.
- **Layering**: Implement GPU compositor layering using `will-change` on high-frequency scroll containers.
- **Theme**: Neutralize hardcoded zinc-900/950 colors in the Design Tuner to ensure proper Light Mode behavior.

**Tech Stack:** React 19, Tailwind CSS 4, CSS Compositor Layering, Hardware Acceleration.

---

### Task 1: Hardware-Accelerated Global Scaling

**Files:**
- Modify: `src/components/layout/AppShell.tsx` (Replace zoom with transform)

- [ ] **Step 1: Refactor AppShell scaling logic**
Replace `zoom` with `transform` and add dimension compensation.

```tsx
// src/components/layout/AppShell.tsx
// Inside AppShell component:
<div 
  className="relative flex flex-1 overflow-hidden" 
  style={{ 
    transform: `scale(${displayScale})`,
    transformOrigin: 'top left',
    width: `${100 / displayScale}%`,
    height: `${100 / displayScale}%`,
    willChange: 'transform'
  } as React.CSSProperties}
>
```

- [ ] **Step 2: Commit**
`git commit -m "perf: replace expensive zoom with hardware-accelerated transform in AppShell"`

---

### Task 2: Transition & Scroll Container Optimization

**Files:**
- Modify: `src/app/styles/components.css` (Targeted transitions and will-change)

- [ ] **Step 1: Sanitize tuner-card transitions**
Explicitly define properties to avoid layout-triggering 'all' interpolation.

```css
/* src/app/styles/components.css */
.tuner-card {
  transition: transform var(--button-transition-speed) ease-out,
              box-shadow var(--button-transition-speed) ease-out,
              background-color var(--button-transition-speed) ease-out,
              opacity var(--button-transition-speed) ease-out;
  will-change: transform, box-shadow;
}
```

- [ ] **Step 2: Add compositor hints to scroll containers**
Promote the product grid and cart to their own GPU layers.

```css
/* src/app/styles/components.css */
.custom-scrollbar {
  will-change: scroll-position;
  content-visibility: auto; /* Browser-native virtualization */
}
```

- [ ] **Step 3: Commit**
`git commit -m "perf: optimize card transitions and add GPU layering to scroll containers"`

---

### Task 3: Theme-Aware Design Tuner UI

**Files:**
- Modify: `src/app/design/tuner/page.tsx` (Remove hardcoded dark styles)
- Modify: `src/components/design-tuner/core/TunerSidebar.tsx` (Sanitize blurs)

- [ ] **Step 1: Make DesignTunerPage theme-neutral**
Replace `bg-zinc-950` and `bg-zinc-900/50` with semantic background and card variables.

```tsx
// src/app/design/tuner/page.tsx
<div className="bg-background text-foreground flex h-screen overflow-hidden ... transition-colors duration-300">
// ...
<div className="bg-card/50 flex-1 overflow-y-auto ... backdrop-blur-md transition-all duration-500"
     style={{ transform: `scale(${previewZoom / 16})`, transformOrigin: 'top left', ... }}>
```

- [ ] **Step 2: Optimize Sidebar blurs**
Reduce blur intensity and ensure hardware acceleration.

```tsx
// src/components/design-tuner/core/TunerSidebar.tsx
<BaseSidebarLayout
  className="backdrop-blur-md bg-card/60 transition-all duration-300"
  style={{ transform: 'translateZ(0)' } as any} // Force GPU layer
>
```

- [ ] **Step 3: Commit**
`git commit -m "fix: make Design Tuner theme-aware and optimize blur performance"`

---

### Task 4: ProductCard Hook Optimization

**Files:**
- Modify: `src/components/pos/POSProductGrid.tsx` (Prop drilling)
- Modify: `src/components/pos/ProductCard.tsx` (Remove hook redundancy)

- [ ] **Step 1: Extract settings dependency from ProductCard**
Pass only the required `font_size` values from the grid to avoid 100+ instances of `useSettings`.

- [ ] **Step 2: Commit**
`git commit -m "perf: reduce re-render overhead in ProductCard by extracting hook dependency"`
