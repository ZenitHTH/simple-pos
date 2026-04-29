# Spec: Image Linking Exclusivity Fix

Enforce a 1:1 relationship between an image and a product in the database while providing a user-friendly way to "move" images between products.

## 1. Problem Statement
Currently, a single image can be linked to multiple products because the `product_images` table lacks a uniqueness constraint on `image_id`. This causes "glitches" where an image appears in multiple product cards, which is not the intended behavior for Vibe POS.

## 2. Goals
- Prevent an image from being linked to more than one product.
- Provide a clear UI prompt when a user tries to link an already-linked image.
- Implement an atomic "move" operation to transfer an image between products.

## 3. Architecture

### 3.1 Backend (Rust/Diesel)

#### Changes to `src-tauri/src/commands/images.rs`:
- **Refactor `link_product_image`**:
    - Before inserting a new link, check if the `image_id` already exists in `product_images`.
    - If it exists, find the `title` of the linked product from the `product` table.
    - Return an error string: `ALREADY_LINKED: {product_title}`.
- **New Command `move_product_image`**:
    - **Arguments**: `dbKey: String`, `image_id: i32`, `new_product_id: i32`.
    - **Logic**: 
        1. Start a database transaction.
        2. Delete any existing records in `product_images` where `image_id == image_id`.
        3. Insert a new record into `product_images` with `{ product_id: new_product_id, image_id: image_id }`.
        4. Commit transaction.

#### Database Constraint (Optional but Recommended):
- Consider adding a `UNIQUE` constraint to `image_id` in `product_images` in a future migration for extra safety, though the command-level check handles the logic for now.

### 3.2 Frontend (React/Next.js)

#### Changes to `src/lib/api/images.ts`:
- Add `moveProductImage` wrapper for the new Tauri command.

#### Changes to `src/app/manage/images/hooks/useImageManagement.ts`:
- Update `toggleLink` logic:
    - If `link_product_image` fails with an error starting with `ALREADY_LINKED: `:
        1. Parse the product name from the error string.
        2. Open a "Move Image Confirmation" modal.
        3. If user confirms "Move", call `moveProductImage`.
        4. If user cancels, do nothing.

#### UI Components:
- **Move Confirmation Modal**: A new modal (or reuse `AlertContext`) that clearly states the source product and the destination product.

## 4. Testing Strategy
- **Manual Verification**:
    1. Link Image A to Product 1.
    2. Try to link Image A to Product 2.
    3. Verify the "Already Linked" prompt appears with "Product 1" mentioned.
    4. Click "Move Image".
    5. Verify Image A is now ONLY linked to Product 2.
- **Backend Test**: Add a unit test in `src-tauri/database/tests/product_image_test.rs` (if exists) or similar to verify exclusivity logic.
