# Undo/Redo History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a robust Undo/Redo system for design changes.

**Architecture:** Use a twin-stack approach (past/future) within the `SettingsContext` to store historical states of `AppSettings`, triggered by discrete user actions.

**Tech Stack:** React (Context API), Framer Motion, TypeScript.

---

### Task 1: Context Enhancements

**Files:**
- Modify: `src/context/settings/SettingsContext.tsx`

- [ ] **Step 1: Add history stacks to state**

```typescript
const [past, setPast] = useState<AppSettings[]>([]);
const [future, setFuture] = useState<AppSettings[]>([]);
```

- [ ] **Step 2: Implement `undo`, `redo`, and `commitHistory`**

```typescript
const commitHistory = () => {
  setPast((prev) => [...prev.slice(-19), settings]);
  setFuture([]); // Clear future on new action
};

const undo = () => {
  if (past.length === 0) return;
  const previous = past[past.length - 1];
  const newPast = past.slice(0, -1);
  
  setFuture((prev) => [settings, ...prev]);
  setPast(newPast);
  setSettings(previous);
};

const redo = () => {
  if (future.length === 0) return;
  const next = future[0];
  const newFuture = future.slice(1);
  
  setPast((prev) => [...prev, settings]);
  setFuture(newFuture);
  setSettings(next);
};
```

- [ ] **Step 3: Update `SettingsContextType` and Provider value**

- [ ] **Step 4: Commit**

```bash
git add src/context/settings/SettingsContext.tsx
git commit -m "feat(settings): add undo/redo stacks and logic to context"
```

### Task 2: UI Integration (Controls)

**Files:**
- Modify: `src/components/design-mode/BottomControlPanel.tsx`

- [ ] **Step 1: Add Undo/Redo buttons**

Use `FaUndo` and `FaRedo` from `react-icons/fa`.

- [ ] **Step 2: Commit**

```bash
git add src/components/design-mode/BottomControlPanel.tsx
git commit -m "feat(ui): add undo/redo buttons to BottomControlPanel"
```

### Task 3: Keyboard Shortcuts

**Files:**
- Modify: `src/components/layout/AppShell.tsx` (or `SettingsProvider` if preferred)

- [ ] **Step 1: Implement global keydown listener**

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      if (e.shiftKey) redo(); else undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      redo();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [undo, redo]);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/AppShell.tsx
git commit -m "feat(ux): add keyboard shortcuts for undo/redo"
```

### Task 4: Action-Based Commits

**Files:**
- Modify: `src/components/design-tuner/ui/TunerSlider.tsx`
- Modify: `src/components/design-tuner/panels/ThemePresetsPanel.tsx`

- [ ] **Step 1: Trigger `commitHistory` on discrete actions**

For sliders, trigger commit on `onMouseUp`. For buttons (presets), trigger commit on `onClick`.

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/ui/TunerSlider.tsx src/components/design-tuner/panels/ThemePresetsPanel.tsx
git commit -m "feat(settings): trigger history commits on user actions"
```
