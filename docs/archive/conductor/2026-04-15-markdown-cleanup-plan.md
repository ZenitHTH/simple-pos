# Implementation Plan - Project Cleanup: Markdown Archiving

This plan aims to declutter the project root and the `conductor/` directory by moving dated, completed, or task-specific Markdown files into a dedicated archive.

## Objective
Reduce the "noise" of excessive `.md` files while preserving important documentation and the core system configuration.

## Key Files & Context
- **Important Files (KEEP):**
    - `CLAUDE.md` (Project overview and guidelines)
    - `GEMINI.md` (Agent-specific instructions)
    - `README.md` (Project summary and setup)
    - `TODO.md` (Current project tracking)
    - `conductor/vibe-pos-manual.md` (Comprehensive project manual)
- **Target Directories:**
    - `docs/archive/root/` (Archive for root-level `.md` files)
    - `docs/archive/conductor/` (Archive for `conductor/` `.md` files)

## Implementation Steps

### 1. Root Directory Cleanup
Move the following files to `docs/archive/root/`:
- `E2E_MIGRATION_TODO.md`
- `SKILL.md` (Empty template)
- `TODO_settings_refactor.md`
- `TUNER_REFACTOR_TODO.md`

### 2. Conductor Directory Cleanup
Move the following files to `docs/archive/conductor/`:
- `2026-04-09-custom-color-palette-design.md`
- `2026-04-09-custom-color-palette-plan.md`
- `2026-04-12-theme-library-design.md`
- `2026-04-12-theme-library-plan.md`
- `2026-04-14-documentation-enhancement.md`
- `app-settings-refactor.md`
- `bottom-bar.md`
- `design-tuner-refactor.md`
- `fix-minituner-drag.md`
- `playwright-e2e-migration-plan.md`
- `react-draggable-migration.md`
- `recipe-stock-enhancements-plan.md`
- `replace-alert-with-toast-plan.md`
- `settings-lib-design.md`
- `settings-lib-restructure.md`
- `tuner-sidebar-numpad-grid-design.md`
- `tuner-sidebar-numpad-grid-plan.md`

## Verification & Testing
1.  Verify that `docs/archive/root/` and `docs/archive/conductor/` contain the moved files.
2.  Verify that `CLAUDE.md`, `GEMINI.md`, `README.md`, `TODO.md`, and `conductor/vibe-pos-manual.md` still exist in their original locations.
