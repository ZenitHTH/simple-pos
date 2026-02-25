# Improved Implementation Plan (Optimized for AI Agents)

This plan addresses a bug in image storage location changes and adds two new features: image crop simulation and tune mode color customization. It is designed to be highly specific and actionable for a code generation agent.

## User Review Required
>
> [!IMPORTANT]
>
> - **Database Migration**: Required to add an `image_object_position` column to `product` using Diesel CLI.
> - **Data Migration**: Changing the image path will invoke a rust `std::fs::copy` of all images tracked in the `images` table if their physical paths exist, followed by `std::fs::remove_file` for cleanup.

## Proposed Changes

### 1. Bug Fix: Move Images on Path Change

We will add a specific backend command to handle data migration rather than burying it implicitly in `save_settings`.

#### [MODIFY] [settings.rs](file:///c:/Users/peter/git/simple-pos/src-tauri/src/commands/settings.rs)

- Create a new Tauri command: `migrate_image_directory(new_path: String, key: String) -> Result<(), String>`.
- **Logic**:
  1. Create the `new_path` directory if it doesn't exist.
  2. Query `database::image::get_all_images`.
  3. Iterate through each image:
     a. Compute the destination path using the image's existing filename/hash.
     b. `std::fs::copy(old_path, dest_path)` if the old file exists.
     c. Update the database `file_path` record for the image.
     d. Delete the file at the old path.
- Export `migrate_image_directory` in Tauri builder mapping.

#### [MODIFY] [GeneralSettings.tsx](file:///c:/Users/peter/git/simple-pos/src/components/settings/GeneralSettings.tsx)

- Add API invocation for `settingsApi.migrateImageDirectory(newPath)`.
- Trigger the migration command *before* saving the new `image_storage_path` config. Let the user know the migration succeeded via Toast.

---

### 2. Feature: Image Crop Simulation

Allow the user to position an image using CSS `object-position`.

#### [NEW] [migration](file:///c:/Users/peter/git/simple-pos/src-tauri/database/migrations/)

- Use `diesel migration generate add_image_object_position`.
- Update the up.sql: `ALTER TABLE product ADD COLUMN image_object_position TEXT;`.
- Update the down.sql: `ALTER TABLE product DROP COLUMN image_object_position;`.

#### [MODIFY] [schema.rs](file:///c:/Users/peter/git/simple-pos/src-tauri/database/src/schema.rs) (auto-generated)

- Update code-generated schema to include the new column.

#### [MODIFY] [model.rs](file:///c:/Users/peter/git/simple-pos/src-tauri/database/src/product/model.rs)

- Update `Product` to include `pub image_object_position: Option<String>`.
- Update `NewProduct` to include `pub image_object_position: Option<String>`.

#### [MODIFY] Frontend Types & UI

- Update `src/lib/types/index.ts` to add `image_object_position?: string | null` to the `Product` interface.
- Update `src/components/manage/ProductModal.tsx`:
  - Add a form field allowing input for "Image Position" (e.g., standard "center", "50% 20%", "top").
  - Recommend providing quick buttons (`Top`, `Center`, `Bottom`) along with a manual input field for advanced offsets.
- Update `src/components/pos/ProductCard.tsx` (and other places displaying product images): Apply `style={{ objectPosition: product.image_object_position || 'center' }}` to the `<img />` tag.

---

### 3. Feature: Tune Mode Color Change

Inject customizable CSS variables into the root to allow real-time color changes.

#### [MODIFY] [settings.rs](file:///c:/Users/peter/git/simple-pos/src-tauri/src/commands/settings.rs)

- Add `pub theme_primary_color: Option<String>` to `AppSettings` (defaulting to `None`).

#### [MODIFY] [SettingsContext.tsx](file:///c:/Users/peter/git/simple-pos/src/context/SettingsContext.tsx)

- Inside the CSS properties `useEffect`, add:
  `root.style.setProperty("--primary", settings.theme_primary_color ?? "#3b82f6");`
  (Assuming the default primary color is blue-500 or similar tailwind default).

#### [MODIFY] [BottomControlPanel.tsx](file:///c:/Users/peter/git/simple-pos/src/components/design-mode/BottomControlPanel.tsx)

- Add a simple standard `<input type="color" />` bonded to `theme_primary_color`.
- Wrap it in a clean icon/box consistent with the `GlobalLayoutControls` style.

## Verification Plan

### Manual Verification

1. **Migration Verification**:
   - Change image storage path via the Settings UI. Observe the physical disk to confirm files are moved correctly and they still render.
2. **Crop Validation**:
   - Set an explicit `50% 10%` to an image in `Manage Products`. Ensure the POS view respects the custom frame alignment without stretching.
3. **Theme Tuning**:
   - Open `/design/tuner`. Select a vibrant new color (e.g. Red `#ff0000`). Confirm the app's primary buttons adapt immediately without reload.
