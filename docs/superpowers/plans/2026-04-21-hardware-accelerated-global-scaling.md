# Hardware-Accelerated Global Scaling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the non-standard and expensive `zoom` property with hardware-accelerated `transform: scale()` in AppShell to resolve scrolling lag and graphical glitches.

**Architecture:** Switch from CPU-based `zoom` layout reflows to GPU-promoted `transform`. Compensate for visual scaling by expanding the container's width and height relative to the scale factor, ensuring the zoomed content fills the viewport correctly.

**Tech Stack:** React, Tailwind CSS, Framer Motion (already in use).

---

### Task 1: Refactor AppShell Scaling

**Files:**
- Modify: `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Replace zoom with transform and add dimension compensation**

In `src/components/layout/AppShell.tsx`, replace the style attribute of the div that handles global display scaling.

**Old Code:**
```tsx
      <div 
        className="relative flex flex-1 overflow-hidden" 
        style={{ zoom: displayScale } as React.CSSProperties}
      >
```

**New Code:**
```tsx
      <div 
        className="relative flex flex-1 overflow-hidden" 
        style={{ 
          transform: `scale(${displayScale})`,
          transformOrigin: 'top left',
          width: `calc(100% / ${displayScale})`,
          height: `calc(100% / ${displayScale})`,
          willChange: 'transform'
        } as React.CSSProperties}
      >
```

- [ ] **Step 2: Run build or lint to verify no breakage**

Run: `npm run lint` (or just verify in dev mode if possible)

- [ ] **Step 3: Commit changes**

```bash
git add src/components/layout/AppShell.tsx
git commit -m "perf: replace expensive zoom with hardware-accelerated transform scale"
```
