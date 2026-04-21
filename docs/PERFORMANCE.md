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

## 4. CSS: Hardware Acceleration & Layout Stability
**Mandate**: Avoid layout-triggering properties and favor the GPU compositor.

*   **Scaling**: Use `transform: scale()` instead of the expensive `zoom` property.
    *   *Note*: When using scale, compensate dimensions with `width: calc(100% / scale)`.
*   **Transitions**: NEVER use `transition: all`. Explicitly define properties (e.g., `transition: transform 0.2s, opacity 0.2s`).
*   **GPU Promotion**: Use `will-change: transform` on high-frequency scroll containers and elements with hover effects (e.g., `.tuner-card`).
*   **Virtualization**: Use `content-visibility: auto` on long lists to enable browser-native virtualization.

---

## 5. Build System & Tooling
*   **Turbopack**: File-system caching is enabled (`turbopackFileSystemCacheForDev`). Ensure new configurations do not break the artifact cache.
*   **Redundancy**: Avoid "Hook Pollution." Pass specific values as props (Prop Drilling) rather than calling heavy context hooks (like `useSettings`) in 100+ child instances (e.g., `ProductCard`).

---

**Last Audit**: April 21, 2026.
*Do not revert to manual connections or broad transitions.*
