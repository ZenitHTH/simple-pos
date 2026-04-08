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

### 🎨 UX & Aesthetics (Brainstormed Ideas)
- [ ] **On-Canvas Direct Manipulation**: Add drag handles to the `SelectableOverlay` for resizing components directly on the screen.
- [ ] **Floating Mini-Tuners**: Display small contextual menus next to selected components for quick adjustments.
- [ ] **Ghost Layout Previews**: Show faint outlines of original sizes during scaling to provide better spatial context.
- [ ] **Animated Scaling**: Implement spring physics (e.g., via Framer Motion) to make UI transitions feel more premium and fluid.
- [ ] **Color Sampler**: Add a tool to pick colors directly from product images to set as the primary theme color.
- [ ] **Undo/Redo History**: Add a state stack to allow users to revert design changes step-by-step.
