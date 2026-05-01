# Security and Logic Maintenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate security vulnerabilities and logic regressions identified during audit and code review.

**Architecture:** 
- Implement manual `Debug` for sensitive Rust structs.
- Utilize `validate_path_within` for settings storage.
- Isolate E2E test hooks behind environment checks.
- Refactor engine detection to use React state/effects.

**Tech Stack:** Rust (Tauri), TypeScript (React 19, Next.js 16)

---

### Task 1: Hardening the Rust Backend

**Files:**
- Modify: `src-tauri/database/src/connection.rs`
- Modify: `src-tauri/settings_lib/src/manager.rs`

- [ ] **Step 1: Redact secrets in SqlCipherCustomizer debug logs**
Modify `src-tauri/database/src/connection.rs`. Remove `#[derive(Debug)]` and implement manually.

```rust
// src-tauri/database/src/connection.rs
use std::fmt;

pub struct SqlCipherCustomizer {
    hex_key: String,
}

impl fmt::Debug for SqlCipherCustomizer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SqlCipherCustomizer")
            .field("hex_key", &"[REDACTED]")
            .finish()
    }
}
```

- [ ] **Step 2: Fix JSON path for custom DB storage**
Update `read_custom_db_storage_path` in `src-tauri/database/src/connection.rs` to reflect the nested `storage` object.

```rust
// src-tauri/database/src/connection.rs
fn read_custom_db_storage_path(data_dir: &Path) -> Option<PathBuf> {
    let settings_path = data_dir.join("settings.json");
    let content = fs::read_to_string(settings_path).ok()?;
    let json: serde_json::Value = serde_json::from_str(&content).ok()?;
    
    json.get("storage")
        .and_then(|s| s.get("db_storage_path"))
        .and_then(|v| v.as_str())
        .map(PathBuf::from)
}
```

- [ ] **Step 3: Tighten path validation in save_settings**
Modify `src-tauri/settings_lib/src/manager.rs` to use `validate_path_within` against the app data directory.

```rust
// src-tauri/settings_lib/src/manager.rs
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    let path = get_settings_path()?;
    let app_dir = path.parent().ok_or("Cannot determine app directory")?;

    // Validate storage paths are within app data directory
    if let Some(ref p) = settings.storage.db_storage_path {
        crate::paths::validate_path_within(p, app_dir)?;
    }
    if let Some(ref p) = settings.storage.image_storage_path {
        crate::paths::validate_path_within(p, app_dir)?;
    }
    // ...
}
```

- [ ] **Step 4: Verify Backend**
Run `cd src-tauri && cargo check` to ensure no compilation errors.

### Task 2: Cleaning up the Frontend UI

**Files:**
- Modify: `src/components/common/SmoothScroll.tsx`
- Modify: `src/components/cart/CartItem.tsx`
- Modify: `src/hooks/features/usePOSLogic.tsx`

- [ ] **Step 1: Fix SmoothScroll engine detection**
Update `src/components/common/SmoothScroll.tsx` to re-render when the `data-engine` attribute is set.

```tsx
// src/components/common/SmoothScroll.tsx
export default function SmoothScroll({ children, className = "" }: SmoothScrollProps) {
  const [isLinux, setIsLinux] = useState(false);

  useEffect(() => {
    const engine = document.documentElement.getAttribute("data-engine");
    if (engine === "webkitgtk") {
      setIsLinux(true);
    }
  }, []);

  if (isLinux) {
    return <div className={className}>{children}</div>;
  }
  // ...
}
```

- [ ] **Step 2: Remove unused import in CartItem**
Remove `FaTrashAlt` from `src/components/cart/CartItem.tsx`.

- [ ] **Step 3: Optimize state sync in usePOSLogic**
Move render-loop state updates into `useEffect` or `useTransition`.

```tsx
// src/hooks/features/usePOSLogic.tsx
  // ...
  useEffect(() => {
    if (isMockupMode) {
      setCartItems(exampleCartItems);
      setIsPaymentModalOpen(mockupView === "payment");
    } else {
      setCartItems([]);
      setIsPaymentModalOpen(false);
    }
  }, [isMockupMode, mockupView]);
  // ...
```

### Task 3: Securing Test Hooks

**Files:**
- Modify: `src/context/DataContext.tsx`
- Modify: `src/lib/api/categories.ts`
- Modify: `src/lib/api/products.ts`
- Modify: `src/lib/api/receipts.ts`
- Modify: `src/lib/api/settings.ts`

- [ ] **Step 1: Guard window exposures**
Wrap all `(window as any).* = ...` assignments in a `process.env.NODE_ENV === 'development'` check.

```tsx
// Example for all listed files
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).categoryApi = categoryApi;
}
```

- [ ] **Step 2: Verify Frontend**
Run `npm run lint` and `npm run build` to ensure no regressions.
