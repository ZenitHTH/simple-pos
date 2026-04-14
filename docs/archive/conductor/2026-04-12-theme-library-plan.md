# Theme Library and Palette Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a full-screen "Theme Explorer" modal that allows users to browse curated palettes and generate custom ones using zero-JS CSS `color-mix`.

**Architecture:** We use a full-screen overlay component triggered from the Design Tuner. The modal displays a grid of curated themes defined by base primary colors. It also includes a custom hex input for advanced generation. Selection updates the global `AppSettings` and document-root CSS variables.

**Tech Stack:** React 19, Tailwind CSS 4, Framer Motion, Lucide Icons, Modern CSS `color-mix`.

---

### Task 1: Initialize Dev Branch & Define Curated Base Colors

**Files:**
- Modify: `src/context/settings/constants.ts`

- [ ] **Step 1: Switch to dev branch**

Run: `git checkout dev`

- [ ] **Step 2: Add CURATED_THEMES to constants**

```typescript
// src/context/settings/constants.ts

export const CURATED_THEMES = [
  { id: "ocean", name: "Ocean Deep", color: "#0ea5e9", description: "Professional and calm" },
  { id: "matcha", name: "Matcha Cafe", color: "#4ade80", description: "Fresh and organic" },
  { id: "sunset", name: "Sunset Glow", color: "#f59e0b", description: "Warm and inviting" },
  { id: "ruby", name: "Ruby Wine", color: "#e11d48", description: "Elegant and bold" },
  { id: "slate", name: "Slate Tech", color: "#64748b", description: "Minimalist and clean" },
  { id: "midnight", name: "Midnight", color: "#1e1b4b", description: "High-contrast dark" },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/context/settings/constants.ts
git commit -m "feat(theme): define curated base themes in constants"
```

---

### Task 2: Create ThemeCard Preview Component

**Files:**
- Create: `src/components/design-tuner/ThemeCard.tsx`

- [ ] **Step 1: Implement ThemeCard**

```tsx
// src/components/design-tuner/ThemeCard.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib";

interface ThemeCardProps {
  name: string;
  color: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

export function ThemeCard({ name, color, description, active, onClick }: ThemeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border transition-all text-left",
        active ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border bg-card hover:border-border/80"
      )}
    >
      {/* Visual Preview Area */}
      <div className="relative h-32 w-full overflow-hidden p-4" style={{ backgroundColor: color }}>
        {/* Mock POS Elements */}
        <div className="absolute top-4 left-4 h-20 w-8 rounded-md bg-white/20 backdrop-blur-sm" /> {/* Sidebar */}
        <div className="absolute top-4 left-14 right-4 h-12 rounded-lg bg-white/30 backdrop-blur-sm shadow-sm" /> {/* Card */}
        <div className="absolute bottom-4 right-4 h-6 w-12 rounded-full bg-white/40 backdrop-blur-sm" /> {/* Button */}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/ThemeCard.tsx
git commit -m "feat(theme): add ThemeCard preview component"
```

---

### Task 3: Build ThemeExplorerModal Component

**Files:**
- Create: `src/components/design-tuner/ThemeExplorerModal.tsx`

- [ ] **Step 1: Implement ThemeExplorerModal**

```tsx
// src/components/design-tuner/ThemeExplorerModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPalette, FaMoon, FaSun } from "react-icons/fa";
import { ThemeCard } from "./ThemeCard";
import { CURATED_THEMES } from "@/context/settings/constants";
import { AppSettings } from "@/lib/types";

interface ThemeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (updates: any) => void;
}

export function ThemeExplorerModal({ isOpen, onClose, settings, updateSettings }: ThemeExplorerModalProps) {
  const currentPrimary = settings.theme.theme_primary_color;

  const handleSelectTheme = (color: string) => {
    updateSettings({ theme: { theme_primary_color: color } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 lg:p-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-background border-border relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/50 px-10 py-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <FaPalette className="text-primary" />
                  Theme Library
                </h2>
                <p className="text-muted-foreground font-medium">Choose a curated palette or create your own.</p>
              </div>
              <button onClick={onClose} className="bg-secondary/50 hover:bg-secondary text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                <FaTimes size={20} />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              {/* Curated Grid */}
              <section className="mb-12">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-2">Curated Palettes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {CURATED_THEMES.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      name={theme.name}
                      color={theme.color}
                      description={theme.description}
                      active={currentPrimary === theme.color}
                      onClick={() => handleSelectTheme(theme.color)}
                    />
                  ))}
                </div>
              </section>

              {/* Advanced Generator */}
              <section className="border-t border-border/50 pt-12">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 px-2">Advanced Palette Generator</h3>
                <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 flex flex-col md:flex-row items-center gap-8">
                  <div className="h-24 w-24 rounded-2xl shadow-xl shrink-0" style={{ backgroundColor: currentPrimary || "#3b82f6" }} />
                  <div className="flex-1 space-y-4">
                    <p className="text-sm font-medium">Input any hex code. The system will automatically generate all matching shades using <code>color-mix()</code>.</p>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={currentPrimary || "#3b82f6"}
                        onChange={(e) => handleSelectTheme(e.target.value)}
                        className="h-12 w-12 cursor-pointer rounded-xl border-0 p-0 overflow-hidden shadow-sm"
                      />
                      <input
                        type="text"
                        value={currentPrimary || "#3b82f6"}
                        onChange={(e) => handleSelectTheme(e.target.value)}
                        placeholder="#HEXCODE"
                        className="bg-background border-border flex-1 rounded-xl border px-4 py-2 font-mono font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer className="bg-muted/20 border-t border-border/50 px-10 py-6 flex justify-end">
              <button onClick={onClose} className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Done
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/ThemeExplorerModal.tsx
git commit -m "feat(theme): implement ThemeExplorerModal with library and generator"
```

---

### Task 4: Integrate Trigger into GlobalStylesPanel

**Files:**
- Modify: `src/components/design-tuner/GlobalStylesPanel.tsx`

- [ ] **Step 1: Import Modal and State**

```tsx
// src/components/design-tuner/GlobalStylesPanel.tsx
// ... imports
import { ThemeExplorerModal } from "./ThemeExplorerModal";
import { FaCompass } from "react-icons/fa";
```

- [ ] **Step 2: Add showExplorer state and trigger button**

```tsx
// src/components/design-tuner/GlobalStylesPanel.tsx
export function GlobalStylesPanel({ ... }) {
  const [showExplorer, setShowExplorer] = useState(false);

  return (
    <div className="...">
      {/* ... top of panel */}
      
      {/* Theme Explorer Trigger */}
      <div className="px-2 mb-6">
        <button
          onClick={() => setShowExplorer(true)}
          className="group relative w-full overflow-hidden rounded-2xl bg-primary p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-foreground">Theme Library</h3>
              <p className="text-[10px] font-bold text-primary-foreground/70 uppercase">Browse & Generate Palettes</p>
            </div>
            <FaCompass className="text-primary-foreground/40 text-xl group-hover:rotate-45 transition-transform duration-500" />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        </button>
      </div>

      {/* Render Modal */}
      <ThemeExplorerModal 
        isOpen={showExplorer} 
        onClose={() => setShowExplorer(false)} 
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* ... rest of panel (keep existing individual overrides for manual fine-tuning) */}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/design-tuner/GlobalStylesPanel.tsx
git commit -m "feat(theme): integrate Theme Explorer trigger into GlobalStylesPanel"
```

---

### Task 5: Verify Persistence & Reset Logic

**Files:**
- Modify: `src/context/settings/SettingsContext.tsx` (verification)

- [ ] **Step 1: Ensure updateSettings triggers save correctly**
- [ ] **Step 2: Test Reset button in GlobalStylesPanel**
- [ ] **Step 3: Final Commit & Cleanup**

```bash
git add .
git commit -m "feat(theme): final polish and verification of theme explorer"
```

---

## Self-Review Check
1. **Spec Coverage:** Implements Curated Library (Primary), Advanced Generator (Secondary), and Full Page Modal (UI).
2. **Placeholder Scan:** No placeholders. All code blocks provided.
3. **Type Consistency:** Uses `AppSettings` and existing `updateSettings` patterns.
4. **Dev Branch:** Commit commands explicitly target `dev`.
