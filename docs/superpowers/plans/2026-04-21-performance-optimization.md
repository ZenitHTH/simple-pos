# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Vibe POS into a high-performance, 2026-standard local-first application by optimizing IPC overhead, database connection management, and React 19 rendering patterns.

**Architecture:** 
- **Backend**: Implement a thread-safe connection pool using `r2d2` with a custom SQLCipher authenticator to eliminate re-authentication latency. Consolidate multi-step checkout into a single atomic Tauri command.
- **Frontend**: Transition from manual loading states to React 19 **Actions** and **Transitions**, using `useOptimistic` for instant cart feedback and `useTransition` to keep the UI responsive during heavy DB writes.

**Tech Stack:** Rust 2024, Diesel 2.3 (r2d2), Tauri v2, Next.js 16, React 19 (Actions/Transitions).

---

### Task 1: Backend Connection Pooling & SQLCipher Customizer

**Files:**
- Modify: `src-tauri/database/Cargo.toml` (Add r2d2 dependencies)
- Modify: `src-tauri/database/src/connection.rs` (Implement Pool & Customizer)
- Modify: `src-tauri/src/main.rs` (Manage Pool in Tauri state)

- [ ] **Step 1: Add r2d2 to database crate**
Add `r2d2` and enable the feature in `diesel`.

```toml
# src-tauri/database/Cargo.toml
[dependencies]
r2d2 = "0.8"
diesel = { version = "^2.3.6", features = ["sqlite", "returning_clauses_for_sqlite_3_35", "chrono", "r2d2"] }
```

- [ ] **Step 2: Implement SQLCipher Connection Customizer**
This ensures every connection pulled from the pool is automatically unlocked and optimized.

```rust
// src-tauri/database/src/connection.rs
use diesel::r2d2::{self, ConnectionManager, CustomizeConnection};

pub type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[derive(Debug)]
pub struct SqlCipherCustomizer {
    pub key: String,
}

impl CustomizeConnection<SqliteConnection, r2d2::Error> for SqlCipherCustomizer {
    fn on_acquire(&self, conn: &mut SqliteConnection) -> Result<(), r2d2::Error> {
        let hex_key = hex::encode(&self.key);
        diesel::sql_query(format!("PRAGMA key = \"x'{}'\";", hex_key)).execute(conn).map_err(r2d2::Error::QueryError)?;
        diesel::sql_query("PRAGMA journal_mode = WAL;").execute(conn).map_err(r2d2::Error::QueryError)?;
        diesel::sql_query("PRAGMA synchronous = NORMAL;").execute(conn).map_err(r2d2::Error::QueryError)?;
        Ok(())
    }
}

pub fn create_pool(key: &str) -> Result<DbPool, String> {
    let db_url = get_database_url()?;
    let manager = ConnectionManager::<SqliteConnection>::new(db_url);
    r2d2::Pool::builder()
        .connection_customizer(Box::new(SqlCipherCustomizer { key: key.to_string() }))
        .build(manager)
        .map_err(|e| e.to_string())
}
```

- [ ] **Step 3: Update `establish_connection` to a legacy helper (Optional/Transition)**
Keep the old function for now but mark it for refactoring.

- [ ] **Step 4: Register Pool in Tauri State**
Update `main.rs` to hold the pool globally.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "perf: implement SQLCipher connection pooling with r2d2"
```

---

### Task 2: Consolidated `complete_checkout` Command

**Files:**
- Modify: `src-tauri/src/commands/receipt.rs` (New combined command)
- Modify: `src/lib/api/receipts.ts` (Update frontend API wrapper)

- [ ] **Step 1: Create the `complete_checkout` command in Rust**
Combine header creation, item insertion, and stock deduction into one transaction.

```rust
// src-tauri/src/commands/receipt.rs
#[tauri::command]
pub async fn complete_checkout(
    state: tauri::State<'_, AppState>,
    customer_id: Option<i32>,
    items: Vec<(i32, i32)>,
) -> Result<ReceiptList, String> {
    let pool = state.pool.read().unwrap().clone().ok_or("DB Not Initialized")?;
    let mut conn = pool.get().map_err(|e| e.to_string())?;

    conn.transaction(|conn| {
        let header = receipt::create_receipt_header(conn, None, customer_id)?;
        for (pid, qty) in items {
            let p_info = product::find_product(conn, pid)?;
            let saved_item = receipt::add_item(conn, &NewReceipt {
                receipt_id: header.receipt_id,
                product_id: pid,
                quantity: qty,
                satang_at_sale: p_info.satang,
            })?;
            
            if p_info.use_recipe_stock {
                recipe::deduct_stock_from_recipe(conn, pid, qty, saved_item.id)?;
            } else {
                stock::deduct_stock(conn, pid, qty)?;
            }
        }
        Ok(header)
    }).map_err(|e: diesel::result::Error| e.to_string())
}
```

- [ ] **Step 2: Add `completeCheckout` to `receiptApi` in TypeScript**
```typescript
// src/lib/api/receipts.ts
completeCheckout: async (key: string, data: { customerId?: number, items: { productId: number, quantity: number }[] }): Promise<ReceiptList> => {
  return await invoke("complete_checkout", {
    customerId: data.customerId,
    items: data.items.map(i => [i.productId, i.quantity])
  });
}
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "perf: consolidate checkout into a single atomic Tauri command"
```

---

### Task 3: React 19 Transitions for POS Logic

**Files:**
- Modify: `src/hooks/features/usePOSLogic.tsx` (Refactor `handleConfirmPayment`)

- [ ] **Step 1: Refactor `handleConfirmPayment` to use `useTransition`**
Remove manual `isLoading` logic and use the native pending state.

```typescript
// src/hooks/features/usePOSLogic.tsx
const [isPending, startTransition] = useTransition();

const handleConfirmPayment = useCallback((cashReceived: number) => {
  startTransition(async () => {
    try {
      const receiptList = await receiptApi.completeCheckout(dbKey, {
        customerId: selectedCustomerId,
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
      });
      // ... success logic
    } catch (error) {
      // ... error logic
    }
  });
}, [/* deps */]);
```

- [ ] **Step 2: Update UI components to respect `isPending`**
Disable the checkout button while the transition is active.

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "perf: refactor checkout to use React 19 async transitions"
```

---

### Task 4: Optimistic Cart Updates

**Files:**
- Modify: `src/hooks/features/usePOSLogic.tsx` (Add `useOptimistic`)

- [ ] **Step 1: Implement `useOptimistic` for the Cart**
Make the cart feel instant even if the backend is busy.

```typescript
// src/hooks/features/usePOSLogic.tsx
const [optimisticCart, addOptimisticItem] = useOptimistic(
  cartItems,
  (state, newItem: CartItem) => {
    const existing = state.find(i => i.id === newItem.id);
    if (existing) {
      return state.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
    }
    return [...state, { ...newItem, quantity: 1 }];
  }
);
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "perf: add optimistic UI for instant cart updates"
```

---

### Task 5: Build & Caching Optimizations

**Files:**
- Modify: `next.config.ts` (Enable experimental caching)

- [ ] **Step 1: Enable Turbopack File System Caching**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    reactCompiler: true,
  },
};
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "perf: enable Next.js 16 Turbopack caching and React Compiler"
```
