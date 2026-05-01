# Security and Code Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address identified security vulnerabilities in PII logging and logic issues in settings management, history tracking, and utility scripts.

**Architecture:** 
- Fix `deepMerge` to correctly clone arrays instead of sharing references.
- Enhance `logger` sanitizer to protect against PII leakage in strings, handle non-plain objects correctly, and avoid over-redacting business data.
- Adjust `TunerSlider` event handling to capture history checkpoints *before* state changes.
- Refine `SettingsContext` update logic to ensure user overrides take precedence over theme presets.
- Update `add-jsdocs.mjs` to generate context-aware documentation templates.

**Tech Stack:** TypeScript, React, Next.js, Tauri, Node.js.

---

### Task 1: Fix `deepMerge` Array Cloning

**Files:**
- Modify: `src/lib/utils/deepMerge.ts`

- [ ] **Step 1: Update implementation to clone arrays**

```typescript
export function deepMerge<T>(target: any, source: any): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key]
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      // If source[key] is an object but doesn't exist in target, clone it
      // Ensure arrays are cloned to prevent shared state
      result[key] = (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]))
        ? deepMerge({}, source[key])
        : Array.isArray(source[key]) ? [...source[key]] : source[key];
    }
  }
  return result as T;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils/deepMerge.ts
git commit -m "fix: ensure deepMerge clones arrays to prevent shared state"
```

---

### Task 2: Enhance `logger` Sanitizer

**Files:**
- Modify: `src/lib/logger.ts`

- [ ] **Step 1: Refine object detection and redaction patterns**

```typescript
export function sanitize(input: any, seen = new WeakSet()): any {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    // Redact 13-digit numbers (likely IDs)
    let result = input.replace(/\\b\\d{13}\\b/g, "[REDACTED-ID]");
    // Redact emails
    result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g, "[REDACTED-EMAIL]");
    // Redact common PII labels followed by values (e.g. "Tax ID: 12345")
    result = result.replace(/(tax[ _]?id|national[ _]?id|id[ _]?card|ssn)[: ]+([a-zA-Z0-9-]{5,})/gi, "$1: [REDACTED]");
    return result;
  }

  // Only sanitize plain objects, arrays, and Errors.
  // Other objects (Date, RegExp, etc.) should be returned as-is or handled specifically.
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
      // Refined patterns to avoid redacting non-sensitive data like "tax_rate" or "product.name"
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
        (lowerKey.includes("address") && !lowerKey.includes("mac")) ||
        (lowerKey.includes("customer") && (lowerKey.includes("name") || lowerKey.includes("phone") || lowerKey.includes("email"))) ||
        ((lowerKey.includes("tax") && lowerKey.includes("id")) && !lowerKey.includes("rate") && !lowerKey.includes("enabled")) ||
        (lowerKey.includes("phone") || lowerKey.includes("email") || lowerKey.includes("dob") || lowerKey.includes("birth")) ||
        (lowerKey.includes("national_id") || lowerKey.includes("id_card") || lowerKey.includes("ssn")) ||
        (lowerKey.includes("card") && (lowerKey.includes("number") || lowerKey.includes("cvv") || lowerKey.includes("cvc")))
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/logger.ts
git commit -m "security: enhance PII redaction and object handling in logger"
```

---

### Task 3: Fix `TunerSlider` Undo Timing

**Files:**
- Modify: `src/components/design-tuner/ui/TunerSlider.tsx`

- [ ] **Step 1: Move `commitHistory` to `onPointerDown`**

```typescript
// ... inside TunerSlider component
      <div className="flex items-center h-8">
        <RangeSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onPointerDown={() => commitHistory()}
        />
      </div>
// ...
```

- [ ] **Step 2: Commit**

```bash
git add src/components/design-tuner/ui/TunerSlider.tsx
git commit -m "fix: capture history checkpoint before modification in TunerSlider"
```

---

### Task 4: Fix `SettingsContext` Preset Merge Logic

**Files:**
- Modify: `src/context/settings/SettingsContext.tsx`

- [ ] **Step 1: Ensure user overrides take precedence over presets**

```typescript
// ... inside updateSettings function
  const updateSettings = (updates: DeepPartial<AppSettings>) => {
    setSettings((prev) => {
      let toApply = updates;
      
      if (updates.theme?.theme_preset && updates.theme.theme_preset !== "custom") {
        const preset =
          THEME_PRESETS[updates.theme.theme_preset as keyof typeof THEME_PRESETS];
        if (preset) {
          // Merge preset first, then apply user overrides on top of it
          toApply = deepMerge(preset, updates);
        }
      }

      return deepMerge<AppSettings>(prev, toApply);
    });
  };
// ...
```

- [ ] **Step 2: Commit**

```bash
git add src/context/settings/SettingsContext.tsx
git commit -m "fix: ensure user overrides take precedence over theme presets"
```

---

### Task 5: Refine `add-jsdocs.mjs` Templates

**Files:**
- Modify: `scripts/add-jsdocs.mjs`

- [ ] **Step 1: Update `jsdocTemplate` to distinguish components**

```javascript
// ...
const jsdocTemplate = (name) => {
    const isComponent = /^[A-Z]/.test(name);
    if (isComponent) {
        return `/**\\n * ${name} Component\\n * \\n * @param {Object} props - The properties object.\\n * @returns {JSX.Element | null} The rendered component.\\n */\\n`;
    }
    return `/**\\n * ${name}\\n */\\n`;
};
// ...
```

- [ ] **Step 2: Commit**

```bash
git add scripts/add-jsdocs.mjs
git commit -m "chore: improve JSDoc template selection in automation script"
```

---

### Task 6: Verification and Testing

**Files:**
- Create: `src/lib/utils/__tests__/deepMerge.test.ts`
- Create: `src/lib/utils/__tests__/sanitize.test.ts`

- [ ] **Step 1: Add unit tests for `deepMerge`**

```typescript
import { deepMerge } from "../deepMerge";

describe("deepMerge", () => {
  it("should clone arrays instead of sharing references", () => {
    const source = { items: [1, 2, 3] };
    const target = { items: [] };
    const result = deepMerge<{ items: number[] }>(target, source);
    
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.items).not.toBe(source.items);
  });

  it("should merge nested objects", () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = deepMerge<any>(target, source);
    expect(result.a).toEqual({ b: 1, c: 2 });
  });
});
```

- [ ] **Step 2: Add unit tests for `sanitize`**

```typescript
import { sanitize } from "../../logger";

describe("sanitize", () => {
  it("should redact 13-digit IDs in strings", () => {
    expect(sanitize("ID: 1234567890123")).toBe("ID: [REDACTED-ID]");
  });

  it("should redact emails in strings", () => {
    expect(sanitize("Contact test@example.com")).toBe("Contact [REDACTED-EMAIL]");
  });

  it("should redact sensitive keys in objects", () => {
    const input = { key: "secret-key", normal: "value" };
    expect(sanitize(input)).toEqual({ key: "[REDACTED]", normal: "value" });
  });

  it("should not redact non-sensitive business data", () => {
    const input = { tax_rate: 7, tax_enabled: true };
    expect(sanitize(input)).toEqual({ tax_rate: 7, tax_enabled: true });
  });

  it("should handle Date objects correctly (not convert to empty object)", () => {
    const now = new Date();
    expect(sanitize(now)).toBe(now);
  });
});
```

- [ ] **Step 3: Run tests (if test runner available) or manually verify**

Run: `npm test` (if configured) or verify via temporary script.

- [ ] **Step 4: Commit tests**

```bash
git add src/lib/utils/__tests__/*.ts
git commit -m "test: add unit tests for deepMerge and sanitize"
```
