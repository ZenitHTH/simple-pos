# Unified Logger & PII Sanitization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize PII sanitization and logging across the app, scripts, and E2E tests.

**Architecture:** Update `src/lib/utils/logger.ts` and `scripts/logger.mjs` to include `dbkey` redaction and a `.log()` method. Create a new `e2e/playwright/logger.ts` for the test suite.

**Tech Stack:** TypeScript, Node.js (ESM), Playwright, Tauri.

---

### Task 1: Update Frontend App Logger

**Files:**
- Modify: `src/lib/utils/logger.ts`

- [ ] **Step 1: Update `sanitize` function to include `dbkey` and refine sensitive keys**
```typescript
// src/lib/utils/logger.ts
// Replace the isSensitiveKey logic block
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "dbkey" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
        (lowerKey.includes("address") && !lowerKey.includes("mac")) ||
        (lowerKey.includes("customer") && (lowerKey.includes("name") || lowerKey.includes("phone") || lowerKey.includes("email"))) ||
        ((lowerKey.includes("tax") && lowerKey.includes("id")) && !lowerKey.includes("rate") && !lowerKey.includes("enabled")) ||
        (lowerKey.includes("phone") || lowerKey.includes("email") || lowerKey.includes("dob") || lowerKey.includes("birth")) ||
        (lowerKey.includes("national_id") || lowerKey.includes("id_card") || lowerKey.includes("ssn")) ||
        (lowerKey.includes("card") && (lowerKey.includes("number") || lowerKey.includes("cvv") || lowerKey.includes("cvc"))) ||
        lowerKey.includes("sensitive") || lowerKey.includes("maiden") || lowerKey.includes("zip") || lowerKey.includes("postcode")
      );
```

- [ ] **Step 2: Add `log` method to `logger` object**
```typescript
// src/lib/utils/logger.ts
export const logger = {
  // ... existing methods
  log: async (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      // @ts-ignore
      await info(sMsg, ...sArgs);
    } else {
      console.log(sMsg, ...sArgs);
    }
  },
};
```

- [ ] **Step 3: Verify with manual check**
Create a temporary test file or use a REPL to verify `sanitize({ dbKey: 'secret' })` returns `{ dbKey: '[REDACTED]' }`.

- [ ] **Step 4: Commit**
```bash
git add src/lib/utils/logger.ts
git commit -m "feat(logger): add dbkey redaction and .log() method to app logger"
```

---

### Task 2: Update Script Utility Logger

**Files:**
- Modify: `scripts/logger.mjs`

- [ ] **Step 1: Update `isSensitiveKey` list to include `dbkey`**
```javascript
// scripts/logger.mjs
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "dbkey" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
        (lowerKey.includes("address") && !lowerKey.includes("mac")) ||
        (lowerKey.includes("customer") && (lowerKey.includes("name") || lowerKey.includes("phone") || lowerKey.includes("email"))) ||
        ((lowerKey.includes("tax") && lowerKey.includes("id")) && !lowerKey.includes("rate") && !lowerKey.includes("enabled")) ||
        (lowerKey.includes("phone") || lowerKey.includes("email") || lowerKey.includes("dob") || lowerKey.includes("birth")) ||
        (lowerKey.includes("national_id") || lowerKey.includes("id_card") || lowerKey.includes("ssn")) ||
        (lowerKey.includes("card") && (lowerKey.includes("number") || lowerKey.includes("cvv") || lowerKey.includes("cvc"))) ||
        lowerKey.includes("sensitive") || lowerKey.includes("maiden") || lowerKey.includes("zip") || lowerKey.includes("postcode")
      );
```

- [ ] **Step 2: Commit**
```bash
git add scripts/logger.mjs
git commit -m "feat(logger): sync PII redaction list in scripts logger"
```

---

### Task 3: Create E2E Test Logger

**Files:**
- Create: `e2e/playwright/logger.ts`

- [ ] **Step 1: Implement the synchronized logger for E2E**
```typescript
/**
 * E2E Logger with PII Redaction.
 * Synchronized with src/lib/utils/logger.ts
 */
export function sanitize(input: any, seen = new WeakSet()): any {
  if (input === null || input === undefined) return input;
  if (typeof input === "string") {
    let result = input.replace(/\b\d{13}\b/g, "[REDACTED-ID]");
    result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED-EMAIL]");
    result = result.replace(/(tax[ _]?id|national[ _]?id|id[ _]?card|ssn)[: ]+([a-zA-Z0-9-]{5,})/gi, "$1: [REDACTED]");
    return result;
  }
  if (input !== null && typeof input === "object" && (input.constructor === Object || Array.isArray(input) || input instanceof Error)) {
    if (seen.has(input)) return "[Circular]";
    seen.add(input);
    const isError = input instanceof Error;
    const sanitized: any = Array.isArray(input) ? [] : {};
    if (isError) {
      sanitized.name = input.name;
      sanitized.message = sanitize(input.message, seen);
      sanitized.stack = sanitize(input.stack, seen);
    }
    for (const key of Object.keys(input)) {
      const lowerKey = key.toLowerCase();
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "dbkey" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
        (lowerKey.includes("address") && !lowerKey.includes("mac")) ||
        (lowerKey.includes("customer") && (lowerKey.includes("name") || lowerKey.includes("phone") || lowerKey.includes("email"))) ||
        ((lowerKey.includes("tax") && lowerKey.includes("id")) && !lowerKey.includes("rate") && !lowerKey.includes("enabled")) ||
        (lowerKey.includes("phone") || lowerKey.includes("email") || lowerKey.includes("dob") || lowerKey.includes("birth")) ||
        (lowerKey.includes("national_id") || lowerKey.includes("id_card") || lowerKey.includes("ssn")) ||
        (lowerKey.includes("card") && (lowerKey.includes("number") || lowerKey.includes("cvv") || lowerKey.includes("cvc"))) ||
        lowerKey.includes("sensitive") || lowerKey.includes("maiden") || lowerKey.includes("zip") || lowerKey.includes("postcode")
      );
      if (isSensitiveKey) {
        sanitized[key] = "[REDACTED]";
      } else {
        if (isError && (key === "name" || key === "message" || key === "stack")) continue;
        sanitized[key] = sanitize(input[key], seen);
      }
    }
    return sanitized;
  }
  return input;
}

export const logger = {
  info: (message: string, ...args: any[]) => console.info("[INFO]", sanitize(message), ...args.map(sanitize)),
  error: (message: string, ...args: any[]) => console.error("[ERROR]", sanitize(message), ...args.map(sanitize)),
  warn: (message: string, ...args: any[]) => console.warn("[WARN]", sanitize(message), ...args.map(sanitize)),
  debug: (message: string, ...args: any[]) => console.debug("[DEBUG]", sanitize(message), ...args.map(sanitize)),
  log: (message: string, ...args: any[]) => console.log(sanitize(message), ...args.map(sanitize)),
};
```

- [ ] **Step 2: Commit**
```bash
git add e2e/playwright/logger.ts
git commit -m "feat(e2e): add synchronized PII-safe logger for Playwright"
```

---

### Task 4: Refactor E2E Runner and Scripts

**Files:**
- Modify: `scripts/run-e2e.mjs`

- [ ] **Step 1: Replace all `console.log` and `console.error` with `logger` calls**
```javascript
// Example replacement in scripts/run-e2e.mjs
// Old: console.log(`Starting Tauri app from: ${executablePath}`);
// New: logger.info(`Starting Tauri app from: ${executablePath}`);
```

- [ ] **Step 2: Commit**
```bash
git add scripts/run-e2e.mjs
git commit -m "refactor(scripts): use PII-safe logger in E2E runner"
```

---

### Task 5: Refactor E2E Tests and Helpers

**Files:**
- Modify: `e2e/playwright/helpers.ts`
- Modify: `e2e/playwright/*.spec.ts`

- [ ] **Step 1: Import `logger` and replace `console` calls in `helpers.ts`**
```typescript
import { logger } from './logger';
// Replace console.log and console.error with logger calls
```

- [ ] **Step 2: Import `logger` and replace `console` calls in all spec files**
Files:
- `e2e/playwright/advanced-management.spec.ts`
- `e2e/playwright/design-mode.spec.ts`
- `e2e/playwright/inventory-recipes.spec.ts`
- `e2e/playwright/reporting-history.spec.ts`
- `e2e/playwright/vibe-pos.spec.ts`

- [ ] **Step 3: Run E2E tests to verify**
Run: `npm run test:e2e -- --skip-build`
Expected: Tests pass and terminal output uses sanitized logger format.

- [ ] **Step 4: Commit**
```bash
git add e2e/playwright/
git commit -m "refactor(e2e): use PII-safe logger across all test suites"
```
