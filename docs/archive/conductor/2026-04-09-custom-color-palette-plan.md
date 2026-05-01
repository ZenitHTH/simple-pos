# Custom Color Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a zero-JS custom color palette generator where the user selects a single hex code, and modern CSS `color-mix()` automatically generates the hover, active, and muted shades.

**Architecture:** 
- The user's chosen hex color is stored in `AppSettings` as `theme_primary_color`.
- `useApplySettings` injects this hex code into the document `:root` as `--theme-primary`.
- `globals.css` defines the base `--primary` variable, falling back to `#3b82f6` if `--theme-primary` is absent. It then uses `color-mix(in oklch, ...)` to derive `--primary-hover`, `--primary-active`, `--primary-muted`, and `--primary-glow`.
- Tailwind utility classes and component styles are updated to use these generated CSS variables instead of hardcoded opacity modifiers (like `bg-primary/10`).

**Tech Stack:** React, Tailwind CSS, Native CSS `color-mix()`, Tauri

---

### Task 1: Update CSS Variables in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add Custom Theme Variables**
Update the `:root` block to map `--primary` to the injected `--theme-primary`, and use `color-mix` to generate the interactive states.

```css
@layer base {
  :root {
    /* ... existing variables ... */
    
    /* ── Custom Theme Colors ── */
    /* If --theme-primary is injected via JS, use it; otherwise fallback to default blue */
    --primary-base: var(--theme-primary, #3b82f6);
    
    /* Reassign --primary so Tailwind uses the base color */
    --primary: var(--primary-base);
    
    /* Auto-generated perceptual shades using OKLCH */
    --primary-hover: color-mix(in oklch, var(--primary-base), white 15%);
    --primary-active: color-mix(in oklch, var(--primary-base), black 10%);
    --primary-muted: color-mix(in oklch, var(--primary-base), transparent 90%);
    --primary-glow: color-mix(in oklch, var(--primary-base), transparent 50%);
    
    /* Ensure foreground stays legible (assuming dark text on light primary, or white on dark primary) 
       For now, we keep the default white foreground, but in the future, we could calculate contrast. */
    --primary-foreground: #ffffff;
    
    /* ... rest of root ... */
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): add css color-mix variables for automatic palette generation"
```

### Task 2: Inject `--theme-primary` via Settings Hook

**Files:**
- Modify: `src/context/settings/hooks.ts`

- [ ] **Step 1: Update `useApplySettings`**
Change the injection logic to set `--theme-primary` instead of directly overriding `--primary`.

```typescript
    // Apply primary theme color
    const primaryColor = safeColor(settings.theme_primary_color);
    if (primaryColor) {
      root.style.setProperty("--theme-primary", primaryColor);
    } else {
      root.style.removeProperty("--theme-primary");
    }
```

*(Note: Ensure you remove the old `root.style.setProperty("--primary", primaryColor);` logic).*

- [ ] **Step 2: Commit**

```bash
git add src/context/settings/hooks.ts
git commit -m "refactor(theme): inject theme_primary_color as --theme-primary css variable"
```

### Task 3: Refactor Tailwind Usage for Interactive States

**Files:**
- Modify: `tailwind.config.ts` (if applicable, or configure via `globals.css` `@theme` block)
- Modify: `src/app/globals.css`

*Vibe POS uses Tailwind v4 `@theme` inline blocks.*

- [ ] **Step 1: Update `@theme` block in `globals.css`**
Expose the new CSS variables to Tailwind so we can use classes like `bg-primary-hover`.

```css
@theme inline {
  /* ... existing theme mappings ... */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  
  /* New Interactive States */
  --color-primary-hover: var(--primary-hover);
  --color-primary-active: var(--primary-active);
  --color-primary-muted: var(--primary-muted);
  --color-primary-glow: var(--primary-glow);
  /* ... */
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): expose generated interactive colors to tailwind theme"
```

### Task 4: Refactor UI Components to use New Interactive States

**Files:**
- Modify: `src/components/pos/ProductCard.tsx`
- Modify: `src/components/cart/CartItem.tsx`
- Modify: `src/components/layout/sidebar/SidebarItem.tsx`
- Modify: `src/components/layout/sidebar/SidebarGroup.tsx`

- [ ] **Step 1: Update `ProductCard.tsx`**
Replace `group-hover:bg-primary/10`, `group-active:bg-primary/20`, and similar opacity hacks.

```tsx
        {/* Hover/Tap Overlay with Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-primary-muted group-active:bg-primary-glow">
          <div className="bg-primary text-primary-foreground flex h-14 w-14 translate-y-4 items-center justify-center rounded-2xl opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-active:scale-110">
            <FaPlus size={24} />
          </div>
        </div>
```
```tsx
          <div className="bg-primary-muted text-primary tuner-button px-4 py-2 text-[0.9em] font-black tracking-wide group-hover:bg-primary-hover group-hover:text-primary-foreground transition-all shadow-sm group-active:scale-110 active:shadow-md">
            ADD
          </div>
```

- [ ] **Step 2: Update `CartItem.tsx`**
Replace `hover:border-primary/30`.

```tsx
    <div
      className="bg-background border-border tuner-cart-item group hover:border-primary-glow flex flex-col overflow-hidden border"
    >
```

- [ ] **Step 3: Update `SidebarItem.tsx`**
Replace `shadow-primary/20`.

```tsx
        isActive
          ? "bg-primary text-primary-foreground shadow-primary-glow shadow-md"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
```

- [ ] **Step 4: Update `SidebarGroup.tsx`**
Simplify the `backgroundColor` inline style to use the new `--primary-muted` or a direct `color-mix`. Since we have `--primary-muted` now, we can just use Tailwind classes if opacity is fixed, or keep `color-mix` if it depends on a tunable variable. *We will keep the tunable `sidebar_active_bg_opacity` logic as is, since it already uses `color-mix(in srgb, var(--primary)...)` which perfectly integrates with the new `--primary` variable.*

- [ ] **Step 5: Commit**

```bash
git add src/components/pos/ProductCard.tsx src/components/cart/CartItem.tsx src/components/layout/sidebar/SidebarItem.tsx
git commit -m "refactor(ui): update components to use auto-generated css color-mix states"
```

### Task 5: Enhance GlobalStylesPanel Customizer

**Files:**
- Modify: `src/components/design-tuner/GlobalStylesPanel.tsx`

- [ ] **Step 1: Ensure Color Picker is Functional**
The color picker already exists and updates `settings.theme_primary_color`. We just need to verify it handles the new interactive states seamlessly.

```tsx
        {/* Primary Color Picker */}
        <div className="space-y-2">
          <label className="text-muted-foreground block text-xs font-medium">
            Primary Color (Auto-generates palette)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme_primary_color: e.target.value })
              }
              className="h-8 w-8 cursor-pointer rounded-lg border-0 p-0 overflow-hidden shadow-sm"
            />
            <input
              type="text"
              value={settings.theme_primary_color ?? "#3b82f6"}
              onChange={(e) =>
                updateSettings({ theme_primary_color: e.target.value })
              }
              className="border-input bg-background flex-1 rounded-lg border px-3 py-1 text-xs font-mono shadow-sm focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="#3b82f6"
            />
          </div>
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/GlobalStylesPanel.tsx
git commit -m "feat(tuner): clarify that primary color picker auto-generates palette"
```