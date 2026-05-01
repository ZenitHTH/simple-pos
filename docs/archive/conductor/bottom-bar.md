# Simplification of BottomControlPanel

## Objective
The `BottomControlPanel` currently duplicates functionality that has been successfully offloaded to the floating `MiniTuner` and `TunerSidebar` (such as component scaling and theme picking). The goal is to strip down this bottom bar to an essential, centered "Global Action Bar" that prevents UI clutter and avoids duplicated work.

## Changes
1. **Remove Duplicated Controls:** Remove the `ComponentScaleControls`, `GlobalScaleControls`, and Theme Picker inputs from `BottomControlPanel.tsx`.
2. **Streamline UI:** Transform the panel into a beautifully centered, floating island (`fixed bottom-8 left-1/2 -translate-x-1/2`).
3. **Retain Essentials:** Keep only the core layout controls: `NavigationMenu`, `GlobalLayoutControls`, `DualColumnTuner` (if applicable), and the Save button.

## Verification
- Ensure the Mockup Mode (Design Mode) successfully renders the new, centered, smaller bottom bar.
- Verify that selecting components still spawns the `MiniTuner` perfectly, taking over the granular scaling and styling duties.