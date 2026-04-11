# Custom Color Palette Design Spec

**Date**: 2026-04-09
**Status**: Draft
**Topic**: Zero-JS Custom Color Palette Generator using CSS `color-mix()`

## 1. Overview
Vibe POS aims to provide a highly customizable, "Chrome-like" theme customizer where users can input their exact brand hex code. To maintain maximum performance on low-tier hardware (e.g., Intel Gen 6, Linux), we will bypass heavy JavaScript color libraries (like `chroma.js`) and rely entirely on the browser's native C++ rendering engine via modern CSS `color-mix(in oklch, ...)`.

## 2. Architecture & Data Flow
- **Data Storage:** The database and `AppSettings` will store a single hex string for the custom theme: `theme_primary_color`.
- **CSS Injection:** `SettingsContext` (via `useApplySettings`) will inject this single value into the document `:root` as `--theme-primary`.
- **Palette Generation:** `src/app/globals.css` will automatically calculate all required shades (hover, active, muted, text-on-primary) using the perceptual `oklch` color space to prevent "muddy" or grayish tones.

## 3. CSS Implementation Details
```css
:root {
  /* The base color injected via JS */
  --primary: var(--theme-primary, #3b82f6);
  
  /* Auto-generated perceptual shades */
  --primary-hover: color-mix(in oklch, var(--primary), white 15%);
  --primary-active: color-mix(in oklch, var(--primary), black 10%);
  --primary-muted: color-mix(in oklch, var(--primary), transparent 90%);
  --primary-glow: color-mix(in oklch, var(--primary), transparent 50%);
}
```
*Note: Tailwind classes (like `hover:bg-primary-hover`) will be configured to point to these new CSS variables.*

## 4. UI/UX
- **Customizer Location:** `GlobalStylesPanel` in Design Mode.
- **Interaction:** A simple color picker (`<input type="color">`) alongside a hex text input.
- **Live Preview:** Changes instantly reflect across the POS interface without heavy JS recalculations or re-renders.

## 5. Trade-offs & Fallbacks
- **Pros:** Zero JavaScript overhead during color generation, infinitesimal bundle size impact, mathematically perfect perceptual blending via `oklch`.
- **Cons:** Extremely old browsers (pre-2023) do not support `color-mix`.
- **Mitigation:** Vibe POS runs on Tauri v2 (which uses a modern WebKit/WebView2 engine), so `color-mix` support is guaranteed.

## 6. Testing Strategy
- Verify that vibrant colors (like neon yellow or bright orange) do not turn brown/gray when darkened.
- Ensure the `color-mix` variables correctly override the default Tailwind `--primary` variables in both Light and Dark mode contexts.