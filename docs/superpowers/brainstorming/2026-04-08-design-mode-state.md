# Brainstorming State: Design Mode Refinement

**Date**: 2026-04-08
**Session ID**: 23449-1775636635
**Status**: Paused (Restart required)

## 🎯 Current Objective
Refine the "Design Mode" into a professional WYSIWYG suite including On-Canvas Direct Manipulation and a Color Sampler.

## ✅ Locked Decisions
1.  **Direct Manipulation**: Add circular corner handles to `SelectableOverlay` for drag-to-scale interaction.
2.  **Floating Mini-Tuner**:
    *   **Architecture**: Render via React Portal to avoid parent zoom/clipping.
    *   **Layout**: Tabbed organization (Tab A: Layout, Tab B: Style).
    *   **Positioning**: Anchors to the top-right of the selection bounding box.
    *   **Visibility during Drag**: **Follow & Update** (A) - Stay anchored and follow the component while it is being resized.
3.  **Color Sampler**:
    *   **Split Logic**: Manual picker for Global Theme (Bottom Bar); Sampler for Product Card colors.
    *   **Sampler Mechanism**: Auto-extract top 3 colors from the product's `<img>` tag using a hidden canvas.
    *   **UI**: 3 circular swatches in the "Style" tab of the Mini-Tuner.
    *   **Application**: **Explicit Apply** (B) - Clicking a swatch shows a preview; user must click "Apply" to confirm.

## 🚀 Next Steps
1.  Write the combined Design Spec.
2.  Invoke `writing-plans` for implementation.

