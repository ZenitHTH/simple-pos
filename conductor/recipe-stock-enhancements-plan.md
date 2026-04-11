# Recipe & Stock Enhancements Plan

## Objective

Enhance the Vibe POS Recipe and Stock Management screens by improving the user experience of the `SimpleRecipeBuilder`, introducing inline editing to stock tables, and adding bulk inventory operations (Import/Export for CSV, XLSX, and ODS formats).

## Key Files & Context

- **Recipe Builder**: `src/components/manage/recipe/SimpleRecipeBuilder.tsx`, `RecipeBuilderComponents.tsx`
- **Stock Management**: `src/components/manage/StockTable.tsx`, `MaterialTable.tsx`, `StockPage.tsx`
- **Backend Commands**: `src-tauri/src/commands/stock.rs`
- **API Wrappers**: `src/lib/api/stocks.ts`

## Proposed Solution (Approach A)

- **Recipe Builder UX**: An enhanced dual-column layout utilizing Framer Motion for drag-and-drop feedback and an absolute-positioned SVG overlay to draw quadratic bezier curves between a selected product and its assigned raw materials.
- **Inline Stock Editing**: Custom cell renderers in the frontend featuring a click-to-edit input field paired with quick (+/-) increment buttons. The component will perform optimistic UI updates to ensure immediate feedback.
- **Bulk Operations (CSV, XLSX, ODS)**: Native parsing of these formats inside the Rust backend using new Tauri commands `import_stock_data` and `export_stock_data`. These commands will handle parsing and batch upserting inside a single Diesel transaction for data integrity and speed, leveraging the existing `src-tauri/export_lib` crate.

## Implementation Steps

### Phase 1: Inline Stock Editing

1. Create a new `InlineQuantityEditor.tsx` component with `+`, `-`, and a number input.
2. Update `StockTable.tsx` and `MaterialTable.tsx` to render `InlineQuantityEditor` in the Quantity column.
3. Implement optimistic updates in `useStockManagement.ts` and `useMaterialManagement.ts` that call the existing update API endpoints on blur or enter.

### Phase 2: Recipe Builder Visual UX

1. Wrap the `RecipeTargetItem` and `MaterialSourceItem` components in `framer-motion` `motion.div`s for layout transitions.
2. Add an SVG overlay to `SimpleRecipeBuilder.tsx`.
3. Implement a `useLayoutEffect` hook to calculate DOM coordinates of the selected product header and the `RecipeTargetItem` list items, drawing bezier curves (`<path>`) between them.

### Phase 3: Bulk Data Operations (CSV, XLSX, ODS using `export_lib`)

1. Utilize the existing `src-tauri/export_lib` local crate for CSV, XLSX, and ODS operations. Extend its functionality to support both importing (parsing) and exporting these data formats.
2. Implement an `import_stock_data` command in `src-tauri/src/commands/stock.rs` that delegates to `export_lib` to parse the incoming file data, and then upserts `(product_id, quantity)` inside a `conn.transaction()`.
3. Implement an `export_stock_data` command that delegates to `export_lib` to generate a file payload of the current stock in the requested format.
4. Add `importStockData` and `exportStockData` API wrappers in `src/lib/api/stocks.ts` supporting format selection.
5. Create `ImportExportControls.tsx` for the frontend supporting format selection dropdowns, and add it to the header of `StockPage.tsx`.

## Verification & Testing

- Test inline editing by rapidly clicking `+` and `-` and verifying that the API calls debounce/resolve correctly without UI jank.
- Test the SVG lines in the Recipe Builder by resizing the window to ensure coordinates recalculate.
- Test data import with valid and invalid files across all formats (CSV, XLSX, ODS), ensuring errors are returned gracefully and transactions roll back correctly.

## Alternatives Considered

- *Approach B (Simpler)*: CSS-only highlights instead of drawn lines, and frontend-heavy parsing sending individual API requests. Rejected due to lower visual fidelity and potential performance bottlenecks on large uploads.