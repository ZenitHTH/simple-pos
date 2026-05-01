# Material Tagging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the Material management system to support flexible, tag-based categorization.

**Architecture:** Add a `tags` field (stored as JSON) to the `Material` model, update the Rust backend to handle tag processing, and enhance the frontend to allow tag management and filtering.

**Tech Stack:** Rust, Diesel, Serde, React, TypeScript, Tailwind CSS.

---

### Task 1: Backend Database & Models

**Files:**
- Modify: `src-tauri/database/src/material/model.rs`
- Modify: `src-tauri/database/src/material/schema.rs` (if necessary for Diesel)

- [ ] **Step 1: Add `tags` field to Material struct**

```rust
// In src-tauri/database/src/material/model.rs
#[derive(Debug, Queryable, Selectable, Insertable, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = material)]
pub struct Material {
    pub id: i32,
    pub name: String,
    pub type_: String,
    pub volume: f64,
    pub quantity: i32,
    pub precision: i32,
    pub tags: Option<String>, // JSON string
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/database/src/material/model.rs
git commit -m "feat(material): add tags field to material model"
```

### Task 2: Rust Backend Commands

**Files:**
- Modify: `src-tauri/src/commands/material.rs`

- [ ] **Step 1: Update Material CRUD to handle tags**

Update `insert_material` and `update_material` to accept `tags: Vec<String>` and serialize them to JSON.

```rust
#[tauri::command]
pub fn insert_material(...) -> Result<Material, String> {
    // ... logic to serialize tags to JSON ...
    let new_material = NewMaterial {
        tags: Some(serde_json::to_string(&tags).map_err(|e| e.to_string())?),
        // ...
    };
    // ...
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/src/commands/material.rs
git commit -m "feat(material): support tag serialization in backend"
```

### Task 3: Frontend Types & API

**Files:**
- Modify: `src/lib/types/material.ts`
- Modify: `src/lib/api/material.ts`

- [ ] **Step 1: Update Material Type**

```typescript
// src/lib/types/material.ts
export interface Material {
  id: number;
  name: string;
  type_: string;
  volume: number;
  quantity: number;
  precision: number;
  tags: string[];
}
```

- [ ] **Step 2: Update API layer**

Update `materialApi.create` and `materialApi.update` to send the `tags` array.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types/material.ts src/lib/api/material.ts
git commit -m "feat(material): add tags to frontend types and API"
```

### Task 4: Frontend UI Enhancement

**Files:**
- Modify: `src/components/manage/MaterialModal.tsx`
- Modify: `src/components/manage/MaterialTable.tsx`

- [ ] **Step 1: Update Material Modal**

Add a tag input component to `MaterialModal`.

- [ ] **Step 2: Update Material Table**

Render tags as badges in `MaterialTable`.

- [ ] **Step 3: Commit**

```bash
git add src/components/manage/MaterialModal.tsx src/components/manage/MaterialTable.tsx
git commit -m "feat(material): implement tag management UI"
```

### Task 5: Verification & Testing

- [ ] **Step 1: Test Tag Persistence**

Create/update a material with tags and verify they save/load correctly in the Database.

- [ ] **Step 2: Test Filtering**

Add tag filtering logic to `useMaterialManagement` and ensure the `MaterialTable` reflects filtered results.

- [ ] **Step 3: Commit**

```bash
git add src/app/manage/material/hooks/useMaterialManagement.ts
git commit -m "feat(material): add tag filtering"
```
