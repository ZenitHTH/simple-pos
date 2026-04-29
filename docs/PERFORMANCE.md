# ⚡ Vibe POS - Performance & Architecture Guidelines (2026)

This document establishes the architectural mandates for maintaining the "Instant-Feel" responsiveness and cryptographic integrity of Vibe POS. All new features and refactors **must** adhere to these standards.

---

## 1. Backend: Database Connection Pattern
**Mandate**: Never establish manual connections in commands. Use the global connection pool.

*   **The Pool**: We use `r2d2` with a custom `SqlCipherCustomizer`. This handles the expensive SQLCipher `PRAGMA key` derivation and performance tuning (`WAL` mode, `synchronous=NORMAL`) automatically on acquire.
*   **Access Pattern**:
    ```rust
    #[tauri::command]
    pub async fn my_command(state: tauri::State<'_, crate::AppState>) -> Result<Data, String> {
        let pool_lock = state.pool.read().map_err(|_| "Lock error")?;
        let pool = pool_lock.as_ref().ok_or("DB Not Initialized")?;
        let mut conn = pool.get().map_err(|e| e.to_string())?;
        // Execute business logic...
    }
    ```

---

## 2. IPC Optimization: The "Atomic Command" Rule
**Mandate**: Consolidate multi-step database operations into a single Rust command.

*   **Reasoning**: IPC round-trips between the WebView and Rust are expensive. SQLCipher page re-authentication for multiple small transactions causes visible lag.
*   **Implementation**: Wrap the entire operation in a single Diesel `conn.transaction(|conn| { ... })`.
*   **Golden Example**: See `complete_checkout` in `src-tauri/src/commands/receipt.rs`.

---

## 3. Frontend: React 19 Transitions & Optimism
**Mandate**: Keep the UI thread unblocked using native React 19 primitives.

*   **Transitions**: Wrap all backend-bound async calls in `useTransition`. Use the native `isPending` state to disable buttons and prevent race conditions.
*   **Optimistic UI**: Use `useOptimistic` for high-frequency actions (Cart updates, list clearing). The UI must update instantly, with background persistence handling errors gracefully.
*   **React Compiler**: The project utilizes the React Compiler. Do **not** manually add `useMemo` or `useCallback` unless specifically required for complex dependency trees.

---

## 4. CSS: Tauri Rendering Engines (WebView2 & WebKitGTK)
**Mandate**: Optimize for Chromium (Windows) VRAM and WebKitGTK (Linux) main-thread CPU. Never treat Tauri WebViews like a standard Chrome browser.

*   **Avoid "Layer Explosions" (WebView2)**: Chromium aggressively allocates GPU layers for elements marked with `will-change`. Applying `will-change: transform` or `box-shadow` to repeating elements (e.g., 50+ `ProductCard`s) will exhaust VRAM and cause severe scroll stuttering.
    *   *Fix*: Rely on explicit `transition-[transform,...]` utility classes. The GPU will still accelerate the transition without pre-allocating hundreds of idle layers.
*   **Virtualization Constraints (`content-visibility`)**: 
    *   *Fix*: Apply `content-visibility: auto` **only** to the children *inside* a long list. Applying it to the scrollable parent container itself causes massive layout thrashing in Chromium as the off-screen bounding boxes pop in and out of existence.
    *   Add `contain-intrinsic-size` to elements with `content-visibility` to prevent scrollbar jumping.
*   **The `transition: all` Killer**: 
    *   *Fix*: **NEVER** use `transition: all`. It forces WebKitGTK to monitor and recalculate every inherited CSS property, destroying Linux scrolling performance. Explicitly define exactly what changes (e.g., `transition-[background-color,color,transform,box-shadow] duration-200`).
*   **Hardware Acceleration & Scaling**: 
    *   *Fix*: Use `transform: scale()` instead of the expensive `zoom` property, as `zoom` triggers full CPU layout recalculations on every frame. When using scale, compensate container dimensions with `width: calc(100% / scale)`.

---

## 5. Build System & Tooling
*   **Turbopack**: File-system caching is enabled (`turbopackFileSystemCacheForDev`). Ensure new configurations do not break the artifact cache.
*   **Redundancy**: Avoid "Hook Pollution." Pass specific values as props (Prop Drilling) rather than calling heavy context hooks (like `useSettings`) in 100+ child instances (e.g., `ProductCard`).

---

## 6. Tauri + Next.js 16 Performance Considerations
**Mandate**: Mitigate the "Serialization Tax" and strict React 19 hydration rules.

*   **IPC Latency (The Serialization Tax)**: JSON-RPC serialization between JS and Rust is expensive for large payloads.
    *   **Fix**: Never use "chatty" IPC. Consolidate operations (see Section 2). For binary data (like images), use Tauri v2's Zero-Copy IPC (`Uint8Array`) instead of Base64 strings.
*   **Hydration Mismatches**: React 19 treats hydration mismatches as critical failures, causing visible UI flicker or resets.
    *   **Fix**: Never render local-first or environment-dependent data (e.g., local storage paths, `window` objects) during the initial server-side render. Use the `mounted` state pattern (e.g., `useEffect(() => setMounted(true), [])`) to defer rendering client-specific UI.
*   **WebView Render Blocking**: Heavy React renders on the main thread will lock up the Tauri window (preventing drag/resize).
    *   **Fix**: Always wrap heavy state updates or list renderings in `useTransition` to lower their render priority and keep the OS-level UI responsive.
*   **Dev Server Overhead**: If Hot Module Replacement (HMR) feels slow in Turbopack, it is usually due to "Hook Pollution" (Section 5) causing massive component tree re-evaluations.

---

**Last Audit**: April 28, 2026.
*Do not revert to manual connections or broad transitions.*
