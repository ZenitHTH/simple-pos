# CSS Performance Fix - WebView2/WebKitGTK Optimization

## Context

From TODO.md (lines 62-68), there are three "Fix Later" items related to CSS performance that are now prioritized:

1. **Remove `transition-all` and `will-change`** causing Chromium layer explosion (VRAM exhaustion) in WebView2
2. **Fix `content-visibility: auto`** placement - should only be on children inside scrolling containers, not on scrollable parents or repeating elements
3. **Implement Engine-Specific CSS** - WebView2 (Windows) vs WebKitGTK (Linux) optimizations

**Why this matters:** Vibe POS runs in Tauri WebView which uses different rendering engines:
- **WebView2 (Windows)**: Chromium-based, aggressively allocates GPU layers for `will-change`, causing VRAM exhaustion with 50+ repeating ProductCards
- **WebKitGTK (Linux)**: CPU-based layout, needs explicit `will-change` for GPU promotion, suffers from `transition: all` monitoring all properties

## Implementation Plan

### Phase 1: Remove `will-change` from Repeating Components

**Critical Files:**

1. **`src/components/pos/ProductCard.tsx`** (line 97)
   - Remove `will-change-transform` from "ADD" button
   - Keep `transition-[transform,filter,box-shadow]` (already targeted, good)

2. **`src/components/ui/NumberStepper.tsx`** (lines 50, 60)
   - Remove `will-change-transform` from both decrement/increment buttons
   - These appear multiple times in cart

3. **`src/components/cart/CartSummary.tsx`** (line 78)
   - Remove `will-change-transform` from checkout button

### Phase 2: Fix `content-visibility: auto` Placement

**File: `src/components/pos/ProductCard.tsx`** (line 41)
- Remove `content-visibility: auto` from individual ProductCard grid items
- This causes layout thrashing when scrolling - cards "pop" in/out of existence

**File: `src/components/ui/SettingsSection.tsx`** (line 36)
- Keep as-is (single instance, less critical) but monitor for issues

**If virtualization needed:** Apply `content-visibility` to the **parent grid container**, not individual children.

### Phase 3: Replace `transition: all` with Targeted Properties

**Critical Files:**

1. **`src/app/styles/components.css`** (lines 98, 138, 154)
   - Line 98: `.card-container { transition: all 0.5s; }` → `transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;`
   - Line 138: `.btn-hero { transition: all 0.3s; }` → `transition: background-color 0.2s, color 0.2s, transform 0.1s;`
   - Line 154: `.btn-primary-lg { transition: all 0.3s; }` → same pattern

2. **High-Impact UI Components** (replacing `transition-all` Tailwind class):
   - `src/components/ui/Button.tsx` (line 41)
   - `src/components/ui/Select.tsx` (line 90)
   - `src/components/ui/Modal.tsx` (lines 67, 78)
   - `src/components/filters/ProductFilter.tsx` (lines 46, 78)
   - `src/components/cart/Cart.tsx` (line 47)

   Replace `transition-all` with explicit: `transition-[background-color,color,border-color,transform,box-shadow] duration-200`

### Phase 4: Implement Engine-Specific CSS

**Step 4A: Add Rust IPC Command**

**File: `src-tauri/src/commands/utils.rs`** (or create `system_info.rs`)
```rust
#[tauri::command]
pub fn get_rendering_engine() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    return Ok("webview2".to_string());
    #[cfg(target_os = "linux")]
    return Ok("webkitgtk".to_string());
    #[cfg(target_os = "macos")]
    return Ok("webkit".to_string());
    Ok("unknown".to_string())
}
```

Register in `src-tauri/src/lib.rs` invoke handler.

**Step 4B: Add Frontend API Wrapper**

**File: `src/lib/api/utils.ts`** (or create `src/lib/api/system.ts`)
```typescript
export const getRenderingEngine = async (): Promise<string> => {
  return await invoke("get_rendering_engine");
};
```

**Step 4C: Inject `data-engine` Attribute**

**File: `src/app/layout.tsx`** or create new `src/components/EngineProvider.tsx`
- Use `useEffect` to fetch engine via IPC on mount
- Set `document.documentElement.setAttribute('data-engine', engine)`
- Handle mock mode fallback (no attribute or 'mock')

**Step 4D: Create Engine-Specific CSS Files**

**File: `src/app/styles/webview2.css`** (Windows optimizations)
```css
/* WebView2: Omit will-change to prevent layer explosion */
/* Override any global will-change rules */
[data-engine="webview2"] * {
  will-change: auto !important;
}

/* Ensure explicit transitions instead of transition: all */
[data-engine="webview2"] .card-container,
[data-engine="webview2"] .btn-hero,
[data-engine="webview2"] .btn-primary-lg {
  transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;
}
```

**File: `src/app/styles/webkitgtk.css`** (Linux optimizations)
```css
/* WebKitGTK: Force GPU promotion for smooth animations */
[data-engine="webkitgtk"] .product-card,
[data-engine="webkitgtk"] .cart-item {
  will-change: transform;
}

/* Ensure transitions are explicit */
[data-engine="webkitgtk"] * {
  transition-property: background-color, color, border-color, transform, box-shadow;
  transition-duration: 200ms;
}
```

**Step 4E: Import Engine CSS in `globals.css`**
```css
@import "tailwindcss";
@import "./styles/tokens.css";
@import "./styles/components.css";
@import "./styles/webview2.css";
@import "./styles/webkitgtk.css";
```

## Verification

### Manual Testing
1. **Windows (WebView2)**: Open POS page with 50+ products, scroll smoothly, monitor VRAM usage
2. **Linux (WebKitGTK)**: Verify animations are smooth, no CPU layout thrashing
3. **Design Mode**: Test scaling animations still work with spring physics

### Automated Testing
1. Run `npm run test:e2e` - ensure no regressions
2. Run `npm run lint` - check for CSS/Tailwind issues

### Performance Checklist
- [ ] No `will-change` on repeating elements (ProductCard, NumberStepper)
- [ ] No `transition-all` in core components
- [ ] No `content-visibility: auto` on individual grid items
- [ ] `data-engine` attribute present on `<html>` after mount
- [ ] Engine-specific CSS rules apply correctly

## Critical Files to Modify

| Priority | File | Changes |
|----------|------|---------|
| P0 | `src/components/pos/ProductCard.tsx` | Remove `will-change-transform`, remove `content-visibility` |
| P0 | `src/app/styles/components.css` | Replace `transition: all` with targeted properties |
| P1 | `src/components/ui/NumberStepper.tsx` | Remove `will-change-transform` |
| P1 | `src/components/ui/CartSummary.tsx` | Remove `will-change-transform` |
| P1 | `src/components/ui/*.tsx` | Replace `transition-all` with explicit lists |
| P2 | `src-tauri/src/commands/utils.rs` | Add `get_rendering_engine()` command |
| P2 | `src/lib/api/utils.ts` | Add API wrapper |
| P2 | `src/app/layout.tsx` or new provider | Inject `data-engine` attribute |
| P2 | `src/app/styles/webview2.css` | Create (new file) |
| P2 | `src/app/styles/webkitgtk.css` | Create (new file) |
| P2 | `src/app/globals.css` | Import engine-specific CSS |
