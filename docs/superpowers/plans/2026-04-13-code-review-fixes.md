# Code Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address robustness and code quality issues identified in the code review.

**Architecture:** 
- Fix `deepMerge` to handle nested objects without shared state.
- Refine `logger` to use `Object.keys()` for safer property enumeration.
- Clean up redundant parameters in backend Tauri commands.

**Tech Stack:** TypeScript, Rust.

---

### Task 1: DeepMerge Robustness

**Files:**
- Modify: `src/lib/utils/deepMerge.ts`

- [ ] **Step 1: Update `deepMerge` to clone nested objects from source**

Update the logic to ensure that if a key exists in `source` but not in `target`, the value is deeply merged (cloned) into a new object if it's an object itself.

```typescript
export function deepMerge<T>(target: any, source: any): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key]
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      // If source[key] is an object but doesn't exist in target, clone it
      result[key] = (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]))
        ? deepMerge({}, source[key])
        : source[key];
    }
  }
  return result as T;
}
```

- [ ] **Step 2: Verify with a simple test**

Create a temporary test file to ensure that modifying the merged result doesn't affect the original source object.

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/deepMerge.ts
git commit -m "fix(utils): prevent shared state in deepMerge by cloning source objects"
```

### Task 2: Logger Refinement

**Files:**
- Modify: `src/lib/logger.ts`

- [ ] **Step 1: Use `Object.keys()` in `sanitize`**

Replace `for...in` with `for...of Object.keys()` to avoid iterating over inherited properties.

```typescript
// src/lib/logger.ts around line 59
    for (const key of Object.keys(input)) {
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/logger.ts
git commit -m "refactor(logger): use Object.keys for safer property enumeration in sanitize"
```

### Task 3: Backend Command Cleanup

**Files:**
- Modify: `src-tauri/src/commands/stock.rs`

- [ ] **Step 1: Remove redundant `_app` parameter from `export_stock_data`**

```rust
#[tauri::command]
pub fn export_stock_data(
    key: String,
    path: String,
    format: String
) -> Result<(), String> {
```

- [ ] **Step 2: Verify backend build**

Run `cargo check` in `src-tauri`.

- [ ] **Step 3: Commit**

```bash
git add src-tauri/src/commands/stock.rs
git commit -m "refactor(backend): remove redundant _app parameter from export_stock_data"
```
