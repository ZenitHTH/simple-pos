# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe POS is a **Local-First, Privacy-First** Point of Sale system built with Tauri (Rust backend) and Next.js (frontend). Features include SQLite database with SQLCipher encryption, product/inventory management, recipe-based stock deduction, customer management, and a real-time Design Tuner for UI customization.

## Tech Stack

- **Backend**: Tauri 2.x with Rust 2024, Diesel ORM, SQLite with SQLCipher (AES-256)
- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 2025, Tailwind CSS v4
- **E2E Testing**: Playwright with `tauri-driver` via Chrome DevTools Protocol

## Key Commands

| Command | Description |
| ------- | ----------- |
| `npm run tauri dev` | Start dev server (Turbopack) + Tauri window |
| `npm run tauri build` | Build production executable |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright E2E tests |
| `node scripts/run-e2e.mjs --skip-build` | Run tests only (if already built) |
| `npm run registry` | Update AI component registry (`.agents/ai-components.json`) |

## Architecture

![Architecture Diagram](./mermaid-diagram-2026-02-11-181614.svg)

### Backend Structure (`src-tauri/`)

- **`src/commands/`**: Tauri commands organized by domain (`stock.rs`, `receipt.rs`, `product.rs`)
- **`database/`**: Local crate for Diesel models, schemas, SQLCipher migrations
- **`settings_lib/`**: App configuration and **security path validation**
- **`export_lib/`**: CSV/XLSX/ODS generation with Thai accounting support
- **`image_lib/`**: Content-addressable image storage (SHA-256)

### Frontend Structure (`src/`)

- **`app/`**: Next.js App Router pages
- **`components/`**: 
  - `ui/` - Atomic components (Button, Input, Table)
  - `pos/` - Core register interface
  - `design-mode/` - On-canvas editing tools
  - `design-tuner/` - UI token editors
- **`context/`**: `SettingsContext`, `DatabaseContext`, `ToastContext`, `AlertContext`, `MockupContext`
- **`hooks/`**: Grouped by purpose (`common/`, `features/`, `settings/`)
- **`lib/`**: `api/` (Tauri wrappers), `types/` (centralized definitions), `utils/` (helpers)

### Data Flow

1. **Login**: User provides `dbKey` → `DatabaseContext` initializes encrypted connection pool
2. **Settings Load**: `SettingsContext` injects CSS variables (`--primary`, `--numpad-height`) into `:root`
3. **POS Flow**: Products fetched → `usePOSLogic` manages cart with `useOptimistic` for instant UI
4. **Checkout**: **Single atomic command** (`complete_checkout`) creates receipt + deducts stock in one transaction
5. **Stock Deduction**: Normal mode decrements product stock; Recipe mode deducts from materials

### Design Tuner System

Styles are dynamic, not hardcoded. Flow: `SettingsContext` → CSS variables on `:root` → Tailwind classes → Components.

Users adjust via `/design/tuner` page with `SelectableOverlay` components and sliders. GPU-accelerated with `transform: scale()`.

## Security & Performance Mandates

### Database Access Pattern (CRITICAL)

Never establish manual connections. Always use the global connection pool:

```rust
#[tauri::command]
pub async fn my_command(state: tauri::State<'_, crate::AppState>) -> Result<Data, String> {
    let pool_lock = state.pool.read().map_err(|_| "Lock error")?;
    let pool = pool_lock.as_ref().ok_or("DB Not Initialized")?;
    let mut conn = pool.get().map_err(|e| e.to_string())?;
    // Execute business logic...
}
```

### Atomic Command Rule

**Minimize IPC round-trips.** Consolidate multi-step DB operations into single Rust commands using `conn.transaction(|conn| { ... })`. Example: `complete_checkout` in `src-tauri/src/commands/receipt.rs`.

### Path Validation (VULN-001)

All file operations (exports, custom DB paths, image saves) must use `settings_lib::paths::validate_path_within` to enforce boundaries within the platform-specific app data directory.

### Frontend Performance

- **React 19**: Use `useTransition` for async operations, `useOptimistic` for instant UI feedback. No manual `useMemo`/`useCallback` (React Compiler handles it).
- **CSS**: Use `transform: scale()` not `zoom`. Never use `transition: all` (causes WebKitGTK layout thrashing).
- **IPC**: Avoid chatty calls. Batch operations. Use zero-copy `Uint8Array` for binary data.

## Database Schema Highlights

| Table | Key Fields |
| ----- | ---------- |
| `product` | product_id, title, category_id, satang, use_recipe_stock |
| `stock` | stock_id, product_id, quantity, satang |
| `material` | id, name, type (volume/weight), volume, quantity, precision |
| `recipe_list` | id, product_id |
| `recipe_item` | id, recipe_list_id, material_id, volume_use, unit, volume_use_precision |
| `receipt_list` | receipt_id, datetime_unix, customer_id |
| `receipt_item` | id, receipt_id, product_id, quantity, satang_at_sale |
| `category` | id, name |
| `customer` | id, name, tax_id, address |
| `images` | id, file_name, file_hash, file_path, created_at |
| `product_images` | product_id, image_id (junction) |

## AI Component Registries (Yellowpages)

Consult these before implementing to ensure consistency and discover existing patterns:

| Registry | Purpose |
| -------- | ------- |
| `.agents/tech-docs.json` | Master architectural map, data flow integrity rules |
| `.agents/ai-components.json` | Frontend components, hooks, API wrappers (run `npm run registry` to update) |
| `.agents/ai-backend.json` | Tauri commands, Rust function signatures, DB models |

## Common Tasks

### Adding a Feature

1. **Backend**: Add Diesel model in `src-tauri/database/src/`, implement CRUD, add Tauri command in `src-tauri/src/commands/`
2. **Frontend**: Add API wrapper in `src/lib/api/`, types in `src/lib/types/`, UI components
3. **Update exports** in `src/lib/api/index.ts` and `src/lib/types/index.ts`
4. **Run registry**: `npm run registry` to update component index

### Database Migrations

```bash
diesel migration generate <name>  # Run inside src-tauri/database/
```

Edit `up.sql` and `down.sql`. Migrations run automatically on app start.

### Debugging

- **Backend**: Add `log::info!()` statements, run with `RUST_LOG=debug npm run tauri dev`
- **Frontend**: React DevTools, Next.js console

## Design System

- **Typography**: 18+ Google Fonts (Inter, Prompt, Sarabun, Kanit, etc.)
- **Scaling**: CSS custom properties injected by `SettingsContext`
- **Design Mode**: `/design/tuner` enables on-canvas editing with `SelectableOverlay`

## E2E Testing

Uses Playwright to test the desktop app via Chrome DevTools Protocol (CDP).

### Runner Script: `scripts/run-e2e.mjs`
Automates the full test lifecycle:
1.  **Cleanup**: Deletes existing `simple-pos.db` to ensure a fresh test state.
2.  **Build**: Compiles the Next.js frontend and the Tauri debug binary.
3.  **Orchestration**: Starts the Next.js dev server and waits for readiness (200 OK).
4.  **Launch**: Spawns the Tauri app with `--remote-debugging-port=9223`.
5.  **Execution**: Runs `npx playwright test`.
6.  **Cleanup**: Gracefully terminates all background processes.

### Commands
| Command | Description |
| ------- | ----------- |
| `npm run test:e2e` | Run the full Playwright pipeline (includes build) |
| `node scripts/run-e2e.mjs --skip-build` | Run tests faster if already built |

### Test Structure
- `e2e/playwright/vibe-pos.spec.ts`: Consolidated comprehensive workflow test.
- `e2e/playwright/helpers.ts`: Resilient helper functions for setup, navigation, and interaction.


## AI Development Mandates

### Technical Standards
Strictly follow guidelines and 2025 standards (React 19, Rust 2024, Next.js 16) in **`@conductor/vibe-pos-manual.md`**.

### Project Yellowpages (Registries)
Consult registries before implementing to ensure consistency:
- **`@.agents/tech-docs.json`**: Master architectural map.
- **`@.agents/ai-components.json`**: UI Component registry.
- **`@.agents/ai-backend.json`**: Tauri command/Rust registry.

## Project Structure

- **`src/`**: Next.js frontend source code.
  - `app/`: Application routes and pages (`page.tsx`, `layout.tsx`).
    - `about/`: About page.
    - `history/`: Order history page.
    - `manage/`: Management interface.
      - `categories/`: Category management.
      - `stock/`: Stock management.
    - `mockup/`: Mockup data interface.
    - `setting/`: Settings section.
      - `general/`: General settings.
      - `theme/`: Appearance settings.
      - `display/`: Display scaling.
      - `currency/`: Currency configuration.
      - `tax/`: Tax rules.
      - `export/`: Data export.
  - `components/`: Reusable React components (`cart`, `design-mode`, `filters`, `layout`, `payment`, `pos`, `ui`).
  - `context/`: Global state management (`DatabaseContext`, `SettingsContext`, `MockupContext`).
  - `hooks/`: Custom React hooks.
  - `lib/`: Utility functions and API wrappers (`api.ts`).
  - `types/`: Shared TypeScript definitions.
- **`src-tauri/`**: Rust backend source code.
  - `src/`: Core Rust source files (`main.rs`, `lib.rs`, `commands/`).
  - `database/`: Local crate for database interactions.
  - `export_lib/`: Local crate for handling exports.
  - `capabilities/`: Tauri permission capabilities.
  - `icons/`: Application icons.
  - `tauri.conf.json`: Tauri configuration file.
