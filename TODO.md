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
- [ ] **On-Canvas Hybrid Editor**: Combine direct manipulation with precision controls.
    - **Direct Manipulation**: Add corner drag handles to `SelectableOverlay` for real-time `display_scale` updates.
    - **Tabbed Mini-Tuner**: implement a floating contextual menu (React Portal) with **Tabbed Groups** (Layout vs. Style). Use **Smart Flipping** logic to ensure it stays visible near screen edges.
    - **Live Feedback**: Use real-time updates with spring animations and a "Ghost Outline" showing original dimensions during drag.
- [ ] **Ghost Layout Previews**: Show faint outlines of original sizes during scaling to provide better spatial context.
- [ ] **Animated Scaling**: Implement spring physics (e.g., via Framer Motion) to make UI transitions feel more premium and fluid.
- [ ] **Color Sampler**: Add a tool to pick colors directly from product images to set as the primary theme color.
- [ ] **Undo/Redo History**: Add a state stack to allow users to revert design changes step-by-step.
