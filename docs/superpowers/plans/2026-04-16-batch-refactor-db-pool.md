# Batch Refactor Backend Commands to use Connection Pool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all Tauri commands to use the `DbPool` from `AppState` instead of calling `establish_connection` manually in each command. This improves performance and simplifies the code.

**Architecture:** Use Tauri's state management to inject `AppState`, which contains a `RwLock<Option<DbPool>>`. Each command will acquire a connection from this pool.

**Tech Stack:** Rust, Tauri, Diesel (with SQLCipher), r2d2 (implied by DbPool).

---

### Task 1: Research and Prepare Utility Snippet

**Files:**
- Research: `src-tauri/src/lib.rs` (Done)
- Research: `src-tauri/src/commands/product.rs` (Done)

- [ ] **Step 1: Define the standard connection acquisition logic**

We will use this pattern in every command:
```rust
let pool_lock = state.pool.read().map_err(|_| "Failed to read pool state")?;
let pool = pool_lock.as_ref().ok_or("Database not initialized")?;
let mut conn = pool.get().map_err(|e| e.to_string())?;
```

### Task 2: Refactor `src-tauri/src/commands/product.rs`

**Files:**
- Modify: `src-tauri/src/commands/product.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 3: Refactor `src-tauri/src/commands/stock.rs`

**Files:**
- Modify: `src-tauri/src/commands/stock.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 4: Refactor `src-tauri/src/commands/category.rs`

**Files:**
- Modify: `src-tauri/src/commands/category.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 5: Refactor `src-tauri/src/commands/customer.rs`

**Files:**
- Modify: `src-tauri/src/commands/customer.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 6: Refactor `src-tauri/src/commands/export.rs`

**Files:**
- Modify: `src-tauri/src/commands/export.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 7: Refactor `src-tauri/src/commands/images.rs`

**Files:**
- Modify: `src-tauri/src/commands/images.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 8: Refactor `src-tauri/src/commands/material.rs`

**Files:**
- Modify: `src-tauri/src/commands/material.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 9: Refactor `src-tauri/src/commands/recipe.rs`

**Files:**
- Modify: `src-tauri/src/commands/recipe.rs`

- [ ] **Step 1: Update imports and function signatures**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 10: Refactor `src-tauri/src/commands/receipt.rs`

**Files:**
- Modify: `src-tauri/src/commands/receipt.rs`

- [ ] **Step 1: Update imports and function signatures for remaining commands**
- [ ] **Step 2: Replace `establish_connection` with pool logic**
- [ ] **Step 3: Verify with `cargo check`**

### Task 11: Final Verification

- [ ] **Step 1: Run `cargo check` for the entire project**
- [ ] **Step 2: Run backend tests if available**
