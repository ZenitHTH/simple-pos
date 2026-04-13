# Systematic Documentation Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematically add RustDoc (`///`) and JSDoc (`/** ... */`) comments to all undocumented backend commands, database methods, and frontend components to improve the AI component registries.

**Architecture:** We will process files in logical batches (Backend Commands -> Database -> Frontend UI -> Other Crates). For each file, we will analyze the function signatures and body to write clear, descriptive documentation that explains the purpose, parameters, and return values.

**Tech Stack:** Rust, TypeScript, React.

---

### Task 1: Document Core Backend Commands

**Files:**
- `src-tauri/src/commands/product.rs`
- `src-tauri/src/commands/category.rs`
- `src-tauri/src/commands/stock.rs`
- `src-tauri/src/commands/recipe.rs`
- `src-tauri/src/commands/receipt.rs`
- `src-tauri/src/commands/customer.rs`
- `src-tauri/src/commands/images.rs`
- `src-tauri/src/commands/settings.rs`
- `src-tauri/src/commands/database.rs`

- [ ] **Step 1: Document `product.rs` and `category.rs`**
  - Add `///` comments to all `pub fn` and `#[tauri::command]` functions.
- [ ] **Step 2: Document `stock.rs` and `recipe.rs`**
- [ ] **Step 3: Document `receipt.rs` and `customer.rs`**
- [ ] **Step 4: Document `images.rs`, `settings.rs`, and `database.rs`**
- [ ] **Step 5: Commit changes**
  - `git add src-tauri/src/commands/*.rs`
  - `git commit -m "docs(backend): add RustDoc comments to core tauri commands"`

### Task 2: Document Database Layer (`src-tauri/database`)

**Files:**
- `src-tauri/database/src/product/mod.rs`
- `src-tauri/database/src/category/mod.rs`
- `src-tauri/database/src/stock/mod.rs`
- `src-tauri/database/src/recipe/mod.rs`
- `src-tauri/database/src/receipt/mod.rs`
- `src-tauri/database/src/customer/mod.rs`
- `src-tauri/database/src/image/mod.rs`
- `src-tauri/database/src/product_image/mod.rs`

- [ ] **Step 1: Document models and basic CRUD operations in all modules.**
- [ ] **Step 2: Commit changes**
  - `git add src-tauri/database/src/**/*.rs`
  - `git commit -m "docs(database): add RustDoc comments to database modules"`

### Task 3: Document Frontend UI Components (`src/components/ui`)

**Files:**
- All `.tsx` files in `src/components/ui/` lacking JSDoc.

- [ ] **Step 1: Add JSDoc to foundational UI components (Button, Input, Card, Modal, etc.).**
- [ ] **Step 2: Add JSDoc to specialized UI components (GlobalTable, DualColumnBuilder, SearchInput, etc.).**
- [ ] **Step 3: Commit changes**
  - `git add src/components/ui/*.tsx`
  - `git commit -m "docs(ui): add JSDoc comments to shared UI components"`

### Task 4: Document Other Frontend Components & Hooks

**Files:**
- `src/components/pos/*.tsx`
- `src/components/manage/*.tsx`
- `src/hooks/*.ts*`
- `src/lib/api/*.ts`

- [ ] **Step 1: Document POS and Manage domain components.**
- [ ] **Step 2: Document custom hooks and API wrapper modules.**
- [ ] **Step 3: Commit changes**
  - `git add src/components/ src/hooks/ src/lib/api/`
  - `git commit -m "docs(frontend): add JSDoc to domain components and hooks"`

### Task 5: Finalize and Sync Registry

- [ ] **Step 1: Run registry generation**
  - `npm run registry`
- [ ] **Step 2: Verify that "No documentation provided" is replaced by actual text in `.agents/*.json`**
- [ ] **Step 3: Commit final registries**
  - `git add .agents/*.json`
  - `git commit -m "docs: regenerate AI registries with full documentation"`
