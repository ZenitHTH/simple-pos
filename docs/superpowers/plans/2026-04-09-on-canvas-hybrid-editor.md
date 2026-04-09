# On-Canvas Hybrid Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a professional-grade WYSIWYG editor for Vibe POS that combines direct canvas manipulation (drag-to-scale) with a floating contextual precision menu (MiniTuner), including real-time visual feedback and a product-aware color sampler.

**Architecture:** 
1. **Isolation Layer**: Controls (handles, menu) are rendered via React Portals at 1:1 scale, independent of the component's zoom level.
2. **Context-Driven State**: Selection is tracked via `MockupContext`, and persistent updates flow through `SettingsContext`.
3. **Real-Time Synthesis**: `framer-motion` handles the drag gestures and smooth spring animations.
4. **Color Sampling**: Uses a hidden canvas to extract dominant colors from product images.

**Tech Stack:** React, Next.js, Framer Motion, Tailwind CSS, React Portals.

---

### Phase 1: MiniTuner Foundation (Portal & Floating Logic)

**Files:**
- Create: `src/components/design-mode/MiniTuner.tsx`
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/design-mode/SelectableOverlay.tsx`

- [ ] **Step 1: Create the base MiniTuner component with Portal support**
Create `src/components/design-mode/MiniTuner.tsx`. It should render its content into a `#portal-root` div.

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMockup } from "@/context/MockupContext";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib";

export default function MiniTuner() {
  const { selectedElementId } = useMockup();
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    let root = document.getElementById("portal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "portal-root";
      document.body.appendChild(root);
    }
    setPortalRoot(root);
  }, []);

  if (!mounted || !portalRoot || !selectedElementId) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60]">
       {/* Positioning & Menu Content will go here */}
    </div>,
    portalRoot
  );
}
```

- [ ] **Step 2: Implement "Smart Flipping" positioning logic**
Calculate the selected element's position using `getBoundingClientRect()` and anchor the menu.

```tsx
// Inside MiniTuner.tsx
const [position, setPosition] = useState({ top: 0, left: 0, flip: false });
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const updatePosition = () => {
    const el = document.querySelector(`[data-selectable-id="${selectedElementId}"]`);
    if (!el || !menuRef.current) return;

    const rect = el.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    
    let top = rect.top - 10;
    let left = rect.right + 10;
    let flip = false;

    // Check if right edge overflows screen
    if (left + menuRect.width > window.innerWidth) {
      left = rect.left - menuRect.width - 10;
      flip = true;
    }

    // Check if top overflows screen
    if (top < 10) {
      top = rect.bottom + 10;
    }

    setPosition({ top, left, flip });
  };

  updatePosition();
  const interval = setInterval(updatePosition, 16); // Follow during animations
  window.addEventListener("scroll", updatePosition);
  window.addEventListener("resize", updatePosition);

  return () => {
    clearInterval(interval);
    window.removeEventListener("scroll", updatePosition);
    window.removeEventListener("resize", updatePosition);
  };
}, [selectedElementId]);
```

- [ ] **Step 3: Update SelectableOverlay to include a data attribute for targeting**
Modify `src/components/design-mode/SelectableOverlay.tsx`.

```tsx
// src/components/design-mode/SelectableOverlay.tsx
// Add data-selectable-id attribute to the root div
<div
  data-selectable-id={id}
  className={cn(
    // ...
  )}
  // ...
/>
```

- [ ] **Step 4: Mount MiniTuner in AppShell**
Modify `src/components/layout/AppShell.tsx` to include the `MiniTuner`.

```tsx
// src/components/layout/AppShell.tsx
import MiniTuner from "@/components/design-mode/MiniTuner";

// Inside AppShell component
return (
  <div className="...">
    {/* ... zoomed content ... */}
    <BottomControlPanel />
    <GoBackButton />
    <MiniTuner /> {/* Outside zoomed container, in the overlay layer */}
  </div>
);
```

- [ ] **Step 5: Run tests to verify the menu appears at 100% scale**
Manual check: Select an element, verify a placeholder menu appears near it.
Ensure the menu does not scale when the component scale changes.

- [ ] **Step 6: Commit**
```bash
git add src/components/design-mode/MiniTuner.tsx src/components/layout/AppShell.tsx src/components/design-mode/SelectableOverlay.tsx
git commit -m "feat: implement portal-based MiniTuner with smart positioning"
```

---

### Phase 2: Direct Manipulation (Drag Handles & Ghost Outline)

**Files:**
- Modify: `src/components/design-mode/SelectableOverlay.tsx`
- Modify: `src/app/globals.css` (optional: add handle styles)

- [ ] **Step 1: Add Drag Handles to SelectableOverlay using Framer Motion**
Update `src/components/design-mode/SelectableOverlay.tsx`.

```tsx
"use client";

import { useMockup } from "../../context/MockupContext";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

export default function SelectableOverlay({ id, className = "" }) {
  const { isMockupMode, selectedElementId, selectElement } = useMockup();
  const { settings, updateSettings } = useSettings();
  const [isDragging, setIsDragging] = useState(false);

  if (!isMockupMode) return null;
  const isSelected = selectedElementId === id;

  const handleDrag = (event, info) => {
    // Map movement to scale change
    // info.delta.x / y can be used to calculate a new scale percentage
    const currentScale = settings[id] || 100;
    const sensitivity = 0.5;
    const delta = Math.max(Math.abs(info.delta.x), Math.abs(info.delta.y)) * (info.delta.x + info.delta.y > 0 ? 1 : -1);
    const newScale = Math.min(Math.max(currentScale + delta * sensitivity, 50), 200);
    
    updateSettings({ [id]: newScale });
  };

  return (
    <div
      data-selectable-id={id}
      className={cn(
        "pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-xl transition-all duration-200",
        isSelected ? "border-4 border-primary bg-primary/10" : "border-2 border-transparent hover:border-primary/50 hover:bg-primary/5",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(isSelected ? null : id);
      }}
    >
      {isSelected && (
        <>
          {/* Ghost Outline (Reference to 100% scale) */}
          <div className="absolute inset-0 -z-1 border-2 border-dashed border-muted-foreground/30 pointer-events-none opacity-50" 
               style={{ transform: `scale(${100 / (settings[id] || 100)})` }} />

          {/* Bottom-Right Drag Handle */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDrag={(e, info) => handleDrag(e, info)}
            onDragEnd={() => setIsDragging(false)}
            className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-primary border-4 border-background shadow-xl cursor-nwse-resize z-50 flex items-center justify-center"
            // Reset position after drag
            style={{ x: 0, y: 0 }}
          />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement "Ghost Outline" showing original dimensions**
Ensure the ghost outline stays at 100% size relative to the canvas.

- [ ] **Step 3: Verify real-time scaling and ghost outline behavior**
Manual check: Drag the handle, verify the component resizes and the ghost outline shows the original size.

- [ ] **Step 4: Commit**
```bash
git add src/components/design-mode/SelectableOverlay.tsx
git commit -m "feat: add drag handles and ghost outline to SelectableOverlay"
```

---

### Phase 3: Tabbed Controls (Layout & Style)

**Files:**
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Implement Tabs in MiniTuner**
Add "Layout" and "Style" tabs.

- [ ] **Step 2: Add Layout Tab Controls**
Add sliders for Scale, Padding, and Margins.

```tsx
// In Layout Tab
<div className="space-y-4">
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase text-muted-foreground">Component Scale</label>
    <input 
      type="range" 
      min="50" max="200" 
      value={settings[selectedElementId] || 100}
      onChange={(e) => updateSettings({ [selectedElementId]: Number(e.target.value) })}
      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
    />
    <span className="text-right text-xs font-medium">{settings[selectedElementId] || 100}%</span>
  </div>
  {/* Add padding/margin sliders similarly */}
</div>
```

- [ ] **Step 3: Add Style Tab Placeholder**
Prepare the style tab for the color sampler.

- [ ] **Step 4: Commit**
```bash
git add src/components/design-mode/MiniTuner.tsx
git commit -m "feat: implement tabbed controls in MiniTuner"
```

---

### Phase 4: Color Sampler (Extraction & Explicit Apply)

**Files:**
- Create: `src/hooks/useColorSampler.ts`
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Create the useColorSampler hook**
Implement canvas-based extraction.

```ts
"use client";

import { useState, useCallback } from "react";

export function useColorSampler() {
  const [colors, setColors] = useState<string[]>([]);
  const [isSampling, setIsSampling] = useState(false);

  const sampleImage = useCallback((imgElement: HTMLImageElement) => {
    setIsSampling(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // Simple top dominant color extraction logic (or use a library like color-thief-react)
    // For now, let's assume we pick 3 distinct pixels
    const extractedColors = [
      `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`,
      `rgba(${imageData[40]}, ${imageData[41]}, ${imageData[42]}, 1)`,
      `rgba(${imageData[80]}, ${imageData[81]}, ${imageData[82]}, 1)`
    ];
    setColors(extractedColors);
    setIsSampling(false);
  }, []);

  return { colors, sampleImage, isSampling };
}
```

- [ ] **Step 2: Integrate Color Sampler in Style Tab**
Update `MiniTuner.tsx` to use the sampler and implement "Explicit Apply".

```tsx
// Inside Style Tab of MiniTuner
const { colors, sampleImage } = useColorSampler();
const [previewColor, setPreviewColor] = useState<string | null>(null);

useEffect(() => {
  // Try to find an image within the selected element
  const el = document.querySelector(`[data-selectable-id="${selectedElementId}"]`)?.parentElement;
  const img = el?.querySelector("img");
  if (img && img.complete) {
    sampleImage(img);
  } else if (img) {
    img.onload = () => sampleImage(img);
  }
}, [selectedElementId]);

return (
  <div className="space-y-4">
    <div className="flex gap-2">
      {colors.map((c, i) => (
        <button 
          key={i}
          onClick={() => setPreviewColor(c)}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-all",
            previewColor === c ? "scale-110 border-white ring-2 ring-primary" : "border-transparent"
          )}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
    {previewColor && (
      <div className="flex flex-col gap-2">
         <p className="text-[10px] text-muted-foreground italic">Previewing color...</p>
         <button 
           onClick={() => updateSettings({ theme_primary_color: previewColor })}
           className="w-full bg-primary text-primary-foreground py-2 rounded text-xs font-bold"
         >
           Apply Theme Color
         </button>
      </div>
    )}
  </div>
);
```

- [ ] **Step 3: Implement Revert Logic**
Ensure deselecting reverts the preview color.

- [ ] **Step 4: Commit**
```bash
git add src/hooks/useColorSampler.ts src/components/design-mode/MiniTuner.tsx
git commit -m "feat: implement color sampler with explicit apply workflow"
```

---

### Phase 5: Refinement (Spring Physics & Ghost Previews)

**Files:**
- Modify: `src/components/design-mode/SelectableOverlay.tsx`
- Modify: `src/components/design-mode/MiniTuner.tsx`

- [ ] **Step 1: Add Spring Physics to Framer Motion components**
Use `type: "spring"` for all scaling animations.

- [ ] **Step 2: Refine "Ghost Layout Previews"**
Add faint outlines for other sibling components during scaling.

- [ ] **Step 3: Final Polishing & Testing**
Run full verification of the editor suite.

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "refactor: polish hybrid editor with spring animations and ghost previews"
```
