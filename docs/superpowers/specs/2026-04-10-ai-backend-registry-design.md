# AI Backend Registry (Yellow Pages) Design

## 1. Goal
Extend the existing AI component registry to include backend (Rust) logic. This will create a separate `ai-backend.json` file that acts as a "yellow pages" for Tauri commands, database functions, export utilities, and image processing tools, drastically improving an AI agent's ability to find backend capabilities.

## 2. Approach
We will modify the existing Node.js script (`scripts/generate-registry.mjs`) to scan `.rs` files in addition to TypeScript files. A separate regex parser will handle Rust syntax to extract metadata, function signatures, and return types.

## 3. Target Directories & File Types
The script will now scan for `*.rs` files in the following directories:
- `src-tauri/src/commands` (Type: `rust-command`)
- `src-tauri/database/src` (Type: `rust-db`)
- `src-tauri/export_lib/src` (Type: `rust-lib`)
- `src-tauri/image_lib/src` (Type: `rust-lib`)

## 4. Extraction Logic (Rust)
The script will use a robust regular expression to match Rust function declarations, specifically looking for `pub fn`, `pub async fn`, and functions preceded by the `#[tauri::command]` macro.
- **Type**: Determined by the source directory (e.g., `rust-command`).
- **Name**: The function name.
- **Signature**: The full function signature, including parameters and return types.
- **Description**: Extracted from any `///` doc comments preceding the function.
- **Path**: Relative path from the project root.

## 5. Output Format
The results will be saved to a new file: `.agents/ai-backend.json`.

**Example Output:**
```json
[
  {
    "name": "create_product",
    "type": "rust-command",
    "path": "src-tauri/src/commands/product.rs",
    "description": "Creates a new product in the database.",
    "signature": "pub fn create_product(key: String, title: String) -> Result<Product, String>"
  }
]
```

## 6. Maintenance
The existing `npm run registry` command will be updated to simultaneously generate both `.agents/ai-components.json` (frontend) and `.agents/ai-backend.json` (backend).
