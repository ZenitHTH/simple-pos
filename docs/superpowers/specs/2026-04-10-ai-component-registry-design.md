# AI Component Registry (Yellow Pages) Design

## 1. Goal
Create a "yellow pages" or index for all AI-relevant codebase components (React components, custom hooks, and API functions). This automated registry, stored as a JSON file, dramatically speeds up an AI agent's ability to locate, understand, and reuse existing code elements without resorting to expensive file system searches.

## 2. Approach
An automated Node.js script will run locally to scan the `src/` directory, extract metadata about reusable modules, and output a structured JSON registry.

## 3. Architecture & Integration
### 3.1 Script Location
`scripts/generate-registry.mjs`

### 3.2 NPM Integration
Add `"registry": "node scripts/generate-registry.mjs"` to the `package.json` scripts section.

### 3.3 Target Directories
The script recursively scans:
- `src/components` (Reusable UI and layout components)
- `src/hooks` (Custom React hooks)
- `src/lib/api` (Frontend-to-Backend Tauri API wrappers)

## 4. Extraction Logic
The script reads `.tsx` and `.ts` files and utilizes simple RegExp (or AST parsing if necessary) to extract:
- **Type**: Derived from the folder path (`component`, `hook`, or `api`).
- **Name**: The exported function name, constant name, or default export.
- **Props/Params**: Heuristics to extract the interface/type associated with the props.
- **Description**: Any JSDoc comments preceding the export statement.
- **Path**: Relative path from project root (e.g., `src/components/ui/Button.tsx`).

## 5. Output Format
Saves the extracted data to `.agents/ai-components.json`.

**Example Output:**
```json
[
  {
    "name": "Button",
    "type": "component",
    "path": "src/components/ui/Button.tsx",
    "description": "Primary interactive button with theme support.",
    "props": "ButtonProps"
  }
]
```

## 6. Maintenance
Developers run `npm run registry` locally to update `.agents/ai-components.json`. AI agents working on the codebase can easily read this JSON to find components instantly.
