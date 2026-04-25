# project TODO

## Bugs
- [x] **Image-Product Linking Confusion**: Resolve conflict in image linking logic. Currently, one product can be linked to multiple images, and the exclusivity logic in `useImageManagement.ts` only prevents one image from being linked to multiple products, which is counter-intuitive.
    - **Affected Files**: 
        - `src-tauri/database/src/image/**`
        - `src/app/manage/images/**`
    - **Details**: The user is confused by the relationship. Need to decide if it should be 1:1, 1:N (Product:Images), or if the UI should better represent the current many-to-many relationship.

## Planned Improvements (Design Mode)

### 🛠️ Core Fixes
- [x] **Solid UI Isolation**: Decouple the `BottomControlPanel` from global scaling.
    - **Problem**: Currently, scaling the `html` element makes the control bar scale too, causing it to jump around and potentially look blurry on HD displays.
    - **Solution**: Move `display_scale` logic from the root `html` element to a dedicated content wrapper inside `RootLayout`, keeping the control bar at a constant 100% scale.

### 🎨 UX & Aesthetics (Refined Design)
- [x] **On-Canvas Hybrid Editor**: Combine direct manipulation with precision controls.
    - **Spec**: [2026-04-09-on-canvas-hybrid-editor-design.md](./docs/superpowers/specs/2026-04-09-on-canvas-hybrid-editor-design.md)
    - [x] **Direct Manipulation**: Add corner drag handles to `SelectableOverlay` for real-time `display_scale` updates.
    - [x] **Tabbed Mini-Tuner**: Implement a floating contextual menu (React Portal) with **Tabbed Groups** (Layout vs. Style).
        - [x] **Follow & Update**: Menu follows the element during drag.
        - [x] **Smart Flipping**: Ensures visibility near screen edges.
    - [x] **Live Feedback**: Use real-time updates with spring animations and a "Ghost Outline" showing original dimensions during drag.
- [x] **Color Sampler**: Add a tool to pick colors directly from product images.
    - [x] **Extraction**: Canvas-based extraction of top 3 dominant colors.
    - [x] **Explicit Apply**: Clicking a swatch shows a preview; requires clicking "Apply" to confirm.
- [x] **Ghost Layout Previews**: Show faint outlines of original sizes during scaling to provide better spatial context.
- [x] **Animated Scaling**: Implement spring physics (e.g., via Framer Motion) to make UI transitions feel more premium and fluid.
- [ ] **Undo/Redo History**: Add a state stack to allow users to revert design changes step-by-step.

## Inventory & Recipe Enhancements
- [x] **Inventory Bulk Operations**: Verify import/export for CSV, XLSX, and ODS formats.
    - [x] Add more robust error handling for malformed files in the Rust backend.
    - [x] Implement progress indicators for large file imports.
- [x] **Recipe Builder Visuals**: Finalize and verify SVG connection lines on various screen sizes and resolutions.
    - [x] Add a toggle to show/hide lines for a cleaner look when not needed.
- [x] **Inline Stock Updates**: Perform stress tests on rapid quantity adjustments to ensure database integrity and UI sync.
- [x] **Final Integration**: Merge `feature/recipe-stock-enhancements` branch into `dev` and remove the worktree.

## 🧪 E2E Testing & Image Linking Fixes (Session 2026-04-18)

### ✅ Completed
- [x] **Image Linking Exclusivity**: Enforced 1:1 image-product relationship in backend and added "Move Image" UI flow.
- [x] **E2E Infrastructure**:
    - Added `setupTestBrowser` helper with CDP-to-Mock fallback.
    - Added `data-testid` support to `Input` and `Select` components.
    - Added diagnostic logging and breakout loops to `helpers.ts`.
- [x] **Selector Hardening**: Refactored `inventory-recipes.spec.ts` to use `getByTestId` and `getByRole('combobox')`.

### ⏳ Pending / Next Steps
- [ ] **Fix TEST-A1/TEST-A2 Failure**: The final `expect(page.getByText(/Payment Successful/i)).toBeVisible()` is failing in mock mode.
    - *Investigation*: Check if the toast message or the modal close animation is interfering with the visibility check.
    - *Potential Fix*: Use `page.waitForSelector` with a longer timeout or check for database stock updates directly in the mock state.
- [ ] **Refactor Remaining Specs**: Update the following files to use the new `setupTestBrowser` and `data-testid` pattern:
    - `e2e/playwright/advanced-management.spec.ts`
    - `e2e/playwright/design-mode.spec.ts`
    - `e2e/playwright/reporting-history.spec.ts`
    - `e2e/playwright/vibe-pos.spec.ts`
- [ ] **Clean up Visual Companion**: Close the brainstorm server and remove temporary mockup files.

