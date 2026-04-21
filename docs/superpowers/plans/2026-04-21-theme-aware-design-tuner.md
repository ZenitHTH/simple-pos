# Theme-Aware Design Tuner UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix "black background in light theme" and scrolling glitches in the Design Tuner by making it theme-aware and optimizing blur performance.

**Architecture:** Replace hardcoded `zinc` classes with CSS variable-based utility classes (`bg-background`, `bg-card`). Replace CSS `zoom` with hardware-accelerated `transform: scale()` for better performance on Linux/WebKitGTK. Use `translateZ(0)` and `will-change` to force GPU layering.

**Tech Stack:** React, Next.js, Tailwind CSS, Framer Motion.

---

### Task 1: Refactor `src/app/design/tuner/page.tsx` for Theme Awareness and Performance

**Files:**
- Modify: `src/app/design/tuner/page.tsx`

- [ ] **Step 1: Update Root Container and Preview Canvas**
  - Replace `bg-zinc-950` with `bg-background`.
  - Add `transition-colors duration-300` to the root `div`.
  - Replace `bg-zinc-900/50` with `bg-card/50`.
  - Downgrade `backdrop-blur-3xl` to `backdrop-blur-md`.
  - Replace `zoom: previewZoom / 16` with hardware-accelerated transform logic.

- [ ] **Step 2: Commit Changes**
```bash
git add src/app/design/tuner/page.tsx
git commit -m "style(tuner): make page theme-aware and use hardware-accelerated scaling"
```

### Task 2: Refactor `src/components/design-tuner/core/TunerSidebar.tsx` for Performance

**Files:**
- Modify: `src/components/design-tuner/core/TunerSidebar.tsx`

- [ ] **Step 1: Update Sidebar Layout Blur and GPU Layering**
  - Reduce blur: `backdrop-blur-xl` -> `backdrop-blur-md`.
  - Add `style={{ transform: 'translateZ(0)' } as any}` to `BaseSidebarLayout`.

- [ ] **Step 2: Commit Changes**
```bash
git add src/components/design-tuner/core/TunerSidebar.tsx
git commit -m "perf(tuner): optimize sidebar blur and force GPU layering"
```
