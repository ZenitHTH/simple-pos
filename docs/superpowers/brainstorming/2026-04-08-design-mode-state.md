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
3.  **Color Sampler**:
    *   **Split Logic**: Manual picker for Global Theme (Bottom Bar); Sampler for Product Card colors.
    *   **Sampler Mechanism**: Auto-extract top 3 colors from the product's `<img>` tag using a hidden canvas.
    *   **UI**: 3 circular swatches in the "Style" tab of the Mini-Tuner.

## 🕒 Pending Clarifying Question
*   **Color Application**: Should clicking an extracted swatch apply the color **instantly** (Real-time feedback), or should there be an **"Apply"** button to confirm the choice?
    *   *Agent Recommendation*: Instant Update for a smoother UX.

## 🚀 Next Steps
1.  Finalize the Color Application question.
2.  Write the combined Design Spec.
3.  Invoke `writing-plans` for implementation.
