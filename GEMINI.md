# 🤖 Vibe POS - Agent Operations Manual (GEMINI.md)

Welcome, Gemini. This is your mission-critical "Source of Truth" for **Vibe POS**. This document is designed to onboard you instantly to the project's architecture, patterns, and safety constraints.

---

## 🏗️ 1. Project DNA & Philosophy
Vibe POS is a **Local-First, Privacy-First, High-Customization** Point of Sale system.
- **Local-First**: Data never leaves the machine unless explicitly exported.
- **Privacy-First**: Entire database is AES-256 encrypted (SQLCipher).
- **High-Customization**: The "Design Tuner" allows real-time UI scaling and styling without code changes.

### Core Tech Stack (2025/2026 Standards)
- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, TypeScript 2025.
- **Backend**: Rust 2024, Tauri v2 (Mobile-ready core).
- **Database**: SQLite + SQLCipher (via Diesel ORM).
- **E2E Testing**: Playwright + `tauri-driver`.

---

## 📂 2. Directory Map (Where things live)

### 🦀 Backend (`src-tauri/`)
- `src/commands/`: The "API" of the backend. Every file here maps to a domain (e.g., `stock.rs`, `receipt.rs`).
- `database/`: A local crate for Diesel models, schemas, and SQLCipher migrations.
- `settings_lib/`: Handles app configuration and **Security Path Validation**.
- `export_lib/`: Handles CSV/XLSX/ODS generation.
- `image_lib/`: Secure image processing and storage in app-local directories.

### ⚛️ Frontend (`src/`)
- `app/`: Next.js App Router pages.
- `components/`:
  - `ui/`: Atomic, reusable components (Buttons, Inputs, etc.).
  - `design-tuner/`: Logic for the real-time UI editor.
  - `pos/`: Core register components.
- `context/`: Global state (Settings, Database, Toast, Alert).
- `hooks/`: **Strictly Grouped**:
  - `common/`: Generic helpers (e.g., `useColorSampler`).
  - `features/`: Logic-heavy features (e.g., `usePOSLogic`).
  - `settings/`: Config-specific hooks.
- `lib/`:
  - `api/`: Tauri `invoke` wrappers (The bridge to Rust).
  - `types/`: **Centralized Type Definitions** (Start here to understand data models).
  - `utils/`: Pure helper functions (e.g., `deepMerge`, `logger`).

---

## 🔒 3. Security & Safety Mandates

### 🔑 The `dbKey` Protocol
Most backend commands require a `dbKey` (the decryption key).
- In the frontend, this is managed by `DatabaseContext`.
- **Never** log or hardcode this key.
- Commands often look like: `invoke("my_command", { dbKey, ...args })`.

### 🛡️ Path Validation (VULN-001)
We enforce strict path boundaries. All file operations (exports, image saves) must happen within the platform-specific app data directory.
- **Tool**: Use `settings_lib::paths::validate_path_within` in Rust.
- **Rule**: If a user provides a path, it **must** be validated before use.

### 🧼 Privacy Logging (VULN-003)
Our `logger.ts` and Rust logging (`lib.rs`) filter out sensitive keywords.
- **Filtered Keywords**: `password`, `dbKey`, `ssn`, `tax_id`, `address`, `email`.
- **Constraint**: Do not bypass the central logger for sensitive operations.

---

## 🎨 4. The Design Tuner System
Styles are not hardcoded. They are derived from `AppSettings`.
1. **Load**: `SettingsContext` loads JSON config from disk.
2. **Inject**: It converts values to CSS variables (e.g., `--numpad-height`) on the `:root`.
3. **Apply**: Tailwind classes use these variables (e.g., `h-[var(--numpad-height)]`).
4. **Tune**: Users use sliders in `DesignMode` to update `AppSettings` in real-time.

---

## 🚀 5. Project Meta-Documentation & Registries

To work effectively, you MUST consult these "Source of Truth" files. They are designed to give you a 360-degree view of the project without scanning the entire codebase.

### 📖 `conductor/vibe-pos-manual.md` (The Master Guide)
- **What it is**: A human-readable (and agent-readable) deep dive into the application's logic.
- **Why use it**: It explains the *why* and *how* behind complex systems like the **Design Tuner flow**, the **POS engine logic**, and the **Encrypted Database architecture**. It also contains the "2025 Standards" for React 19 and Rust 2024.

### 🗺️ `.agents/tech-docs.json` (Architectural Map)
- **What it is**: A machine-readable JSON file mapping the entire project structure.
- **Why use it**: Use this to quickly find which local Rust crates handle specific tasks (like `image_lib` for SHA-256 storage) and to understand the "Data Flow Integrity" rules (e.g., Satang-based financial precision).

### 🟡 `.agents/ai-components.json` (Frontend Yellowpages)
- **What it is**: An auto-generated index of every React component, custom hook, and API wrapper.
- **Why use it**: Instead of guessing where a component is, search this file for keywords like "modal", "cart", or "usePOS". It includes file paths, exported names, and detailed descriptions.

### 🦀 `.agents/ai-backend.json` (Backend Yellowpages)
- **What it is**: An auto-generated index of all Tauri commands (Rust) and Database models.
- **Why use it**: Use this to find the exact Rust function signature for a command you need to `invoke` from the frontend, or to see the fields available in a Diesel database model.

---

## 🚀 6. Common Agent Workflows

### 📚 Using the "Yellowpages" (Registries)
Before creating a new component or utility, check the registries:
- `.agents/ai-components.json`: Frontend components/hooks/API.
- `.agents/ai-backend.json`: Backend commands and DB models.
- **Maintenance**: Run `npm run registry` after adding new exports.

### 🧪 Testing & Verification
- **E2E**: Run `npm run test:e2e`. We use Playwright to drive the Tauri window.
- **Lint**: Run `npm run lint` before committing.
- **Backend**: Run `cargo check` inside `src-tauri` for Rust type safety.

### 🛠️ Database Migrations
1. Run `diesel migration generate <name>` inside `src-tauri/database`.
2. Edit `up.sql` and `down.sql`.
3. Migrations run automatically on app start or via `cargo test`.

---

## 🧠 6. Critical Symbols Glossary
- **`Invoke`**: The method used to call Rust from JS (`src/lib/api/invoke.ts`).
- **`SelectableOverlay`**: Component that makes an element clickable in Design Mode.
- **`SQLCipher`**: The reason we need a `dbKey`.
- **`Turbopack`**: Our ultra-fast dev bundler.

---

## 📜 Agent Guidelines
- **Stay Surgical**: When fixing a bug, don't refactor unrelated files.
- **Preserve Security**: Always keep the path validation and PII filtering logic intact.
- **Centralize Types**: Add new interfaces to `src/lib/types/` rather than local files.
- **DRY Registry**: If you add a reusable component, run `npm run registry`.

*This file is your companion. Update it if the project's fundamental patterns change.*
