# AppSettings Deep Refactor Plan

## Background & Motivation
The `AppSettings` configuration has grown organically into a flat "God Struct" containing over 80 fields across both Rust and TypeScript. This has led to spaghetti code in our settings logic and UI components, making it hard to maintain, scale, and reason about. The goal is to clean up this technical debt by grouping related settings into a cohesive, nested hierarchy.

## Scope & Impact
- **Rust Backend**: `src-tauri/src/commands/settings.rs` will be refactored into modular sub-structs.
- **Frontend Types**: `src/lib/types/settings.ts` will mirror the new nested structure.
- **Settings Context**: `src/context/settings/*` will be updated to handle nested state.
- **UI Components**: All components reading settings (e.g., `settings.currency_symbol`) will need to be updated to read from nested paths (e.g., `settings.general.currency_symbol`).
- **Disk Storage**: Existing flat `settings.json` files on user machines will need to be automatically migrated to the new nested format on startup.

## Proposed Solution

### 1. Nested Structure Design
We will break down the flat struct into the following logical groupings:
- **`GeneralSettings`**: `currency_symbol`, `tax_enabled`, `tax_rate`
- **`ThemeSettings`**: `theme_primary_color`, `theme_radius`, `theme_preset`
- **`StorageSettings`**: `image_storage_path`, `db_storage_path`
- **`TypographySettings`**: `font_family`, `base_size`, `heading_weight`, etc.
- **`ScalingSettings`**:
  - `global`: `display_scale`
  - `components`: `sidebar_scale`, `cart_scale`, `grid_scale`, etc.
  - `fonts`: `header_font_scale`, `sidebar_font_scale`, etc.
- **`StylingSettings`**:
  - `cart`: `item_font_size`, `padding`, `margin`, `image_size`, `gap`, `border_style`, `bg_opacity`
  - `payment`: `numpad_height`, `numpad_scale`, `numpad_font_scale`, etc.
  - `grid`: `item_padding`, `item_radius`, `item_shadow`, `gap`, etc.
  - `sidebar`: `icon_size`, `item_spacing`, `item_radius`, `active_bg_opacity`
  - `button`: `radius`, `shadow_intensity`, `transition_speed`

### 2. Rust Migration Strategy
To ensure users don't lose their settings, we will introduce a migration path in `get_settings()`:
```rust
#[derive(Deserialize)]
#[serde(untagged)]
enum SettingsFormat {
    Nested(AppSettings),
    Flat(LegacyFlatAppSettings),
}
```
When loading `settings.json`, we attempt to parse it as `SettingsFormat`. If it parses as `Flat`, we map the legacy fields to the new `AppSettings` nested struct, overwrite the file to persist the new format, and return the updated settings.

### 3. Frontend Context Updates
- `DEFAULT_SETTINGS` in `constants.ts` will be updated to the nested shape.
- `updateSettings` in `SettingsContext.tsx` will be refactored to support deep merging (or specialized nested updaters) so that partial updates don't overwrite entire sub-objects.
- `useApplySettings` in `hooks.ts` will map the nested values to CSS custom properties.

### 4. Component Refactoring
We will do a sweeping find-and-replace across the `src/` directory to update all legacy flat property accesses to their new nested equivalents.

## Alternatives Considered
- **Rust `#[serde(flatten)]` Trick**: We could keep the frontend flat and only nest the Rust struct using serde macros. This was rejected because it leaves the TypeScript codebase in a messy state, and the primary goal was to "fix spaghetti code" universally.

## Verification
- Run `npm run lint` and `tsc --noEmit` to ensure all frontend property accesses have been updated correctly.
- Verify that a mock V1 `settings.json` file successfully migrates to V2 on application launch without data loss.
- Verify that the Design Mode MiniTuner and Settings pages successfully read and update the nested state.
