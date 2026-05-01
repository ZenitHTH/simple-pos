# Unified Logger & PII Sanitization Design

## 1. Goal
Synchronize the PII sanitization and logging logic across the frontend application, utility scripts, and E2E test suite to ensure consistent redaction of sensitive data (especially `dbKey`) and provide a unified logging interface (`.log()`).

## 2. Architecture

### 2.1 Sanitization Logic (`isSensitiveKey`)
The core sanitization logic will be identical in all three environments.
**Sensitive Keywords (Case-Insensitive):**
- `key`, `dbkey` (Mandatory per GEMINI.md)
- `secret`, `password`, `token`, `auth`
- `address` (excluding `mac`)
- `customer` (name, phone, email)
- `tax` + `id` (excluding `rate`, `enabled`)
- `phone`, `email`, `dob`, `birth`
- `national_id`, `id_card`, `ssn`
- `card` (number, cvv, cvc)
- `sensitive`, `maiden`, `zip`, `postcode`

### 2.2 Environment Implementations

#### A. Frontend App Logger (`src/lib/utils/logger.ts`)
- **Language**: TypeScript
- **Output**: 
  - If `isTauri()`: Uses `@tauri-apps/plugin-log` (async).
  - Else: Falls back to `console` (async-wrapped).
- **New Method**: Add `log: (message: string, ...args: any[]) => Promise<void>`.

#### B. Script Utility Logger (`scripts/logger.mjs`)
- **Language**: JavaScript (ESM)
- **Output**: `console` (synchronous).
- **Context**: Used by `run-e2e.mjs` and other Node.js scripts.

#### C. E2E Test Logger (`e2e/playwright/logger.ts`)
- **Language**: TypeScript (Node.js/Playwright context)
- **Output**: `console` (synchronous).
- **Reasoning**: Decoupled from Tauri to avoid import errors in the Playwright environment while maintaining strict PII safety for terminal outputs and traces.

## 3. Implementation Scope

1.  **`src/lib/utils/logger.ts`**: Update `isSensitiveKey` and add `log`.
2.  **`scripts/logger.mjs`**: Update `isSensitiveKey` to match `logger.ts`.
3.  **`scripts/run-e2e.mjs`**: Replace all `console.log` and `console.error` calls with `logger.info`, `logger.error`, or `logger.log`.
4.  **`e2e/playwright/logger.ts`**: Create new file with sanitized logger.
5.  **`e2e/playwright/*.spec.ts` & `helpers.ts`**: Replace `console.log` with `logger.info/log`.

## 4. Platform Constraints (CachyOS/Linux)
- Use `/` for all paths.
- No Windows-specific `taskkill` or `.exe` logic in the logger itself (handled by `run-e2e.mjs`).
- Ensure `logger.mjs` remains compatible with standard Node.js ESM.

## 5. Verification Plan
- **Manual Check**: Log a dummy object containing `dbKey` and `email` in each environment to verify redaction.
- **E2E Run**: Execute `npm run test:e2e` and verify the terminal output is sanitized.
- **Tauri Build**: Run `cargo check` to ensure Rust logging isn't affected.
