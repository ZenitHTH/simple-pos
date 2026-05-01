# Image Linking Exclusivity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the glitch where an image can be linked to multiple products by enforcing 1:1 exclusivity in the backend and providing a "Move Image" UI flow in the frontend.

**Architecture:** 
1. Backend validation in `link_product_image` to check for existing links.
2. New `move_product_image` command for atomic transfers.
3. Frontend handling of `ALREADY_LINKED` errors with a confirmation modal.

**Tech Stack:** Rust (Tauri, Diesel), TypeScript (Next.js, React).

---

### Task 1: Backend Implementation & Testing

**Files:**
- Modify: `src-tauri/src/commands/images.rs`
- Modify: `src-tauri/database/tests/database_tests.rs`

- [ ] **Step 1: Add exclusivity check to `link_product_image`**
```rust
// Inside link_product_image in src-tauri/src/commands/images.rs
let existing_link = database::product_image::get_image_link(&mut conn, image_id).map_err(|e| e.to_string())?;
if let Some(link) = existing_link {
    let product = database::product::find_product(&mut conn, link.product_id)
        .map_err(|_| "Product not found".to_string())?;
    return Err(format!("ALREADY_LINKED: {}", product.title));
}
```

- [ ] **Step 2: Implement `move_product_image` command**
```rust
#[command]
pub fn move_product_image(key: String, image_id: i32, new_product_id: i32) -> Result<(), String> {
    let mut conn = establish_connection(&key).map_err(|e| e.to_string())?;
    conn.transaction(|c| {
        database::product_image::unlink_image_from_all_products(c, image_id)?;
        database::product_image::link_product_image(c, new_product_id, image_id)?;
        Ok(())
    }).map_err(|e: diesel::result::Error| e.to_string())
}
```

- [ ] **Step 3: Add supporting DB functions**
In `src-tauri/database/src/product_image/mod.rs`:
```rust
pub fn get_image_link(conn: &mut SqliteConnection, img_id: i32) -> Result<Option<model::ProductImage>, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;
    product_images.filter(image_id.eq(img_id)).first(conn).optional()
}

pub fn unlink_image_from_all_products(conn: &mut SqliteConnection, img_id: i32) -> Result<usize, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;
    diesel::delete(product_images.filter(image_id.eq(img_id))).execute(conn)
}
```

- [ ] **Step 4: Add unit test to verify exclusivity**
In `src-tauri/database/tests/database_tests.rs`:
```rust
#[test]
fn test_image_linking_exclusivity() {
    let mut conn = setup_test_db();
    // ... setup 2 products and 1 image ...
    // link image to product 1
    // verify second link attempt to product 2 fails (via logic check)
}
```

- [ ] **Step 5: Commit backend changes**
```bash
git add src-tauri/ src-tauri/database/
git commit -m "feat(backend): enforce image linking exclusivity and add move_product_image command"
```

### Task 2: Frontend API and Hook Integration

**Files:**
- Modify: `src/lib/api/images.ts`
- Modify: `src/app/manage/images/hooks/useImageManagement.ts`

- [ ] **Step 1: Add `moveProductImage` to API wrapper**
```typescript
export async function moveProductImage(key: String, imageId: number, productId: number) {
    return await invoke("move_product_image", { key, imageId, productId });
}
```

- [ ] **Step 2: Update `useImageManagement.ts` to handle `ALREADY_LINKED` error**
```typescript
try {
    await invoke("link_product_image", { ... });
} catch (err: any) {
    if (typeof err === 'string' && err.startsWith("ALREADY_LINKED: ")) {
        const productName = err.replace("ALREADY_LINKED: ", "");
        // Trigger modal/alert
    }
}
```

- [ ] **Step 3: Implement `handleMoveImage` function in hook**
```typescript
const handleMoveImage = async (productId: number) => {
    if (!dbKey || !selectedImage) return;
    await moveProductImage(dbKey, selectedImage.id, productId);
    // update local state
};
```

- [ ] **Step 4: Commit frontend logic**
```bash
git add src/lib/api/images.ts src/app/manage/images/hooks/useImageManagement.ts
git commit -m "feat(frontend): integrate image move logic and handle already-linked error"
```

### Task 3: UI Implementation (Modal & Verification)

**Files:**
- Modify: `src/app/manage/images/page.tsx` (or where the link modal lives)

- [ ] **Step 1: Implement the "Move Confirmation" UI**
Use `AlertContext` or a custom modal to show the "Move Image" prompt.

- [ ] **Step 2: Verify with manual testing**
Run the app and perform the sequence: Link -> Attempt duplicate link -> Confirm Move -> Verify link moved.

- [ ] **Step 3: Commit UI changes**
```bash
git add src/app/manage/images/
git commit -m "feat(ui): add move image confirmation modal"
```
