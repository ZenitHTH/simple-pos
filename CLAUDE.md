# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple POS is a desktop Point of Sale application built with Tauri (Rust backend) and Next.js (frontend). The app features a SQLite database with SQLCipher encryption, product/inventory management, recipe-based stock deduction, customer management, and comprehensive settings for UI customization.

## Tech Stack

- **Backend**: Tauri 2.x with Rust, Diesel ORM, SQLite with SQLCipher encryption
- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS v4
- **Build**: Next.js Dev Server (with Turbopack), Tauri CLI for desktop builds

## Key Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Build the Next.js app for production |
| `npm start` | Start the Next.js production server |
| `npm run lint` | Run ESLint |
| `npm run tauri [cmd]` | Run Tauri CLI commands (build, dev, etc.) |
| `npm run test:e2e` | Run WebdriverIO E2E tests |

## Architecture

![Architecture Diagram](./mermaid-diagram-2026-02-11-181614.svg)

### Database Layer (Rust - `src-tauri/database/`)

The database uses Diesel ORM with SQLite and SQLCipher encryption. Key models:

- **Product**: Products with title, category, price (in satang), and `use_recipe_stock` flag
- **Stock**: Product inventory with quantity and price at last update
- **Material**: Ingredients/components with type (volume/weight), quantity, and precision
- **Recipe**: Link products to materials with precise volume use (scaled by precision)
- **Receipt/ReceiptList**: Invoice headers (with customer reference) and line items
- **Category**: Product categories
- **Customer**: Customer info with optional tax ID and address
- **Image**: Binary images stored on disk, tracked via hash in database

Database path is configurable via `db_storage_path` setting; defaults to platform-specific app data directory.

### Frontend Layer (Next.js - `src/`)

Key patterns:

- **Context Providers**: `DatabaseContext` (auth/db connection), `SettingsContext` (UI/app config), `ToastContext` (notifications), `MockupContext` (demo mode)
- **API Layer**: `src/lib/api/` wraps Tauri commands; all API calls require `dbKey` from DatabaseContext
- **Hooks**: `usePOSLogic`, `useCurrency`, `useTax`, custom management hooks
- **Components**: Design-mode components with scale controls, tuner for UI customization

### Data Flow

1. User logs in with database key → `DatabaseProvider` initializes encrypted connection pool via `initialize_database` command.
2. Settings loaded from disk → `SettingsProvider` applies scales via CSS custom properties.
3. POS page: Products fetched → Cart managed via `usePOSLogic` with `useOptimistic` for instant feedback.
4. Payment: Uses a **single atomic transaction** (`complete_checkout`) to create invoice and deduct stock in one IPC round-trip.
5. Stock deduction: Normal mode decrements product stock; Recipe mode deducts from materials.

## Performance & Optimization

Adhere to the high-performance standards in **`docs/PERFORMANCE.md`**.
- **Connection Pooling**: Uses `r2d2` with `SqlCipherCustomizer`. Connections are borrowed from `tauri::State<'_, AppState>`.
- **Atomic Commands**: Consolidate multi-step DB operations into single Rust commands to minimize IPC and SQLCipher overhead.
- **React 19 Transitions**: Heavy async operations (like checkout) use `useTransition` to keep the UI responsive.
- **Hardware Acceleration**: Use `transform: scale()` instead of `zoom`. Avoid `transition: all`.
- **Build**: Next.js 16 with **Turbopack** and **React Compiler** enabled for maximum build and runtime speed.

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

## Common Tasks

### Adding a New Feature

1. Backend: Add Diesel model/schema in `src-tauri/database/src/`, implement CRUD in module, add Tauri command in `src-tauri/src/commands/`
2. Frontend: Add API wrapper in `src/lib/api/`, TypeScript types in `src/lib/types/`, UI components as needed
3. Update exports in `src/lib/api/index.ts` and `src/lib/types/index.ts`

### Database Migrations

Use Diesel CLI: `diesel migration generate <name>`, then implement in `src-tauri/database/migrations/`

### Debugging

- Backend: Add `log::info!()` statements, run with `RUST_LOG=debug npm run tauri dev`
- Frontend: Use React DevTools, Next.js console output

## Design System

- **Typography**: 18+ Google Fonts available (Inter, Prompt, Sarabun, Kanit, etc.)
- **Scaling**: UI scales via CSS custom properties applied by SettingsContext
- **Design Mode**: Toggle via URL `/design/tuner`, enables drag-to-scale overlay

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
