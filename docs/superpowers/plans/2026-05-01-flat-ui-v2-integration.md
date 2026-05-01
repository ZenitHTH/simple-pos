# Flat UI v2 Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the Vibe POS aesthetic into a high-contrast design system using Flat UI Colors v2 (Chinese for Light, Swedish for Dark), removing all Pure White/Black from base layers.

**Architecture:** We will update the system's "Baseline Fallbacks" via CSS variables and React constants, ensuring that "Soft" palette-driven backgrounds are the new default. The Design Tuner will be enhanced with a quick-select swatch list to keep user customizations within the palette's character.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 4, OKLCH (CSS), TypeScript.

---

### Task 1: Update Global Constants & Defaults

**Files:**
- Modify: `src/context/settings/constants.ts`

- [ ] **Step 1: Update `DEFAULT_SETTINGS` with the new palette mapping**

```typescript
// src/context/settings/constants.ts

// ... in DEFAULT_SETTINGS object ...
  theme: {
    theme_primary_color: null, // Defaults to palette primary via CSS
    theme_background_color: "#ced6e0", // Anti-Flash White
    theme_card_color: "#dfe4ea",       // City Lights
    theme_text_color: "#2f3542",       // Prestige Blue
    theme_border_color: "#f1f2f6",     // Pumpkin Patch
    theme_radius: 0.5,
    theme_preset: "cozy",
  },
// ...
```

- [ ] **Step 2: Update `CURATED_THEMES` to include Flat UI specific entries**

```typescript
// src/context/settings/constants.ts

export const CURATED_THEMES: CuratedTheme[] = [
  { id: "flat-cn", name: "Chinese Soft", color: "#5352ed", description: "Flat UI Chinese Palette" },
  { id: "flat-se", name: "Swedish Deep", color: "#575fcf", description: "Flat UI Swedish Palette" },
  // ... keep existing ...
];
```

- [ ] **Step 3: Commit**

```bash
git add src/context/settings/constants.ts
git commit -m "feat: update default settings and themes for Flat UI v2"
```

---

### Task 2: Update CSS Design Tokens

**Files:**
- Modify: `src/app/styles/tokens.css`

- [ ] **Step 1: Update `:root` fallbacks (Chinese Palette)**

```css
/* src/app/styles/tokens.css */

@layer base {
  :root {
    /* ... existing ... */
    --theme-primary: #5352ed; /* Saturated Sky */
    
    /* Soft Base Overrides */
    --theme-background: #ced6e0; /* Anti-Flash White */
    --theme-text: #2f3542;       /* Prestige Blue */
    --theme-card: #dfe4ea;       /* City Lights */
    --theme-border: #f1f2f6;     /* Pumpkin Patch */

    --success: #2ed573; /* Ufo Green */
    --warning: #ffa502; /* Orange */
    --destructive: #ff4757; /* Watermelon */
    /* ... */
  }

  .dark {
    --theme-primary: #575fcf; /* Dark Periwinkle */

    --theme-background: #1e272e; /* Black Pearl */
    --theme-card: #485460;       /* Good Night! */
    --theme-text: #d2dae2;       /* Hint of Elusive Blue */
    --theme-border: #808e9b;     /* London Square */

    --success: #05c46b; /* Green Teal */
    --warning: #ffa801; /* Chrome Yellow */
    --destructive: #ff3f34; /* Red Orange */
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/styles/tokens.css
git commit -m "feat: hardcode Flat UI v2 tokens as system fallbacks"
```

---

### Task 3: Enhance Global Styles Panel

**Files:**
- Modify: `src/components/design-tuner/panels/GlobalStylesPanel.tsx`

- [ ] **Step 1: Define the palette constants locally or in a shared util**

```typescript
const PALETTES = {
  light: ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"],
  dark: ["#ef5777", "#575fcf", "#4bcffa", "#34e7e4", "#0be881", "#f53b57", "#3c40c6", "#0fbcf9", "#00d8d6", "#05c46b", "#ffc048", "#ffdd59", "#ff5e57", "#d2dae2", "#485460", "#ffa801", "#ffd32a", "#ff3f34", "#808e9b", "#1e272e"]
};
```

- [ ] **Step 2: Implement the horizontal Quick-Select swatch list**

```tsx
// src/components/design-tuner/panels/GlobalStylesPanel.tsx

// Under the Primary Color Picker inputs:
<div className="mt-4">
  <label className="text-muted-foreground block text-[10px] font-black uppercase tracking-widest mb-2">
    Quick Palette (Flat UI v2)
  </label>
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
    {(isDarkMode ? PALETTES.dark : PALETTES.light).map((color) => (
      <button
        key={color}
        onClick={() => updateSettings({ theme: { theme_primary_color: color } })}
        className="h-6 w-6 rounded-full shrink-0 transition-transform hover:scale-125 border border-white/10"
        style={{ backgroundColor: color }}
        title={color}
      />
    ))}
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/design-tuner/panels/GlobalStylesPanel.tsx
git commit -m "feat: add Flat UI v2 quick-select swatches to GlobalStylesPanel"
```

---

### Task 4: Verification & Polish

- [ ] **Step 1: Verify Light Mode (Chinese Palette)**
Run the app, toggle to Light Mode, and ensure no Pure White is visible on background layers.

- [ ] **Step 2: Verify Dark Mode (Swedish Palette)**
Toggle to Dark Mode and ensure no Pure Black is visible on background layers.

- [ ] **Step 3: Test Swatch Selection**
Open the Global Styles Panel and verify that clicking a swatch correctly updates the primary accent color.

- [ ] **Step 4: Final Commit**

```bash
git commit --allow-empty -m "docs: flat ui v2 integration complete"
```
