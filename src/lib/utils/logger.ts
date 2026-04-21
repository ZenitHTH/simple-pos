import { info, error, warn, debug } from "@tauri-apps/plugin-log";

// We check if the environment has Tauri available
// Using typeof window ensures we don't crash in SSR (Next.js server)
const isTauri = () => {
  // @ts-ignore
  return typeof window !== "undefined" && window.__TAURI__ !== undefined;
};

/**
 * Basic PII Redaction with Circular Reference protection
 * Redacts sensitive patterns and masks sensitive object keys.
 */
export function sanitize(input: any, seen = new WeakSet()): any {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    // Redact 13-digit numbers (likely IDs)
    let result = input.replace(/\b\d{13}\b/g, "[REDACTED-ID]");
    // Redact emails
    result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED-EMAIL]");
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

    // Special handling for Error objects to include non-enumerable properties
    if (isError) {
      sanitized.name = input.name;
      sanitized.message = sanitize(input.message, seen);
      sanitized.stack = sanitize(input.stack, seen);
    }

    for (const key of Object.keys(input)) {
      const lowerKey = key.toLowerCase();
      // Refined patterns to avoid redacting non-sensitive data like "tax_rate" or "product.name"
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "dbkey" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
        (lowerKey.includes("address") && !lowerKey.includes("mac")) ||
        (lowerKey.includes("customer") && (lowerKey.includes("name") || lowerKey.includes("phone") || lowerKey.includes("email"))) ||
        ((lowerKey.includes("tax") && lowerKey.includes("id")) && !lowerKey.includes("rate") && !lowerKey.includes("enabled")) ||
        (lowerKey.includes("phone") || lowerKey.includes("email") || lowerKey.includes("dob") || lowerKey.includes("birth")) ||
        (lowerKey.includes("national_id") || lowerKey.includes("id_card") || lowerKey.includes("ssn")) ||
        (lowerKey.includes("card") && (lowerKey.includes("number") || lowerKey.includes("cvv") || lowerKey.includes("cvc"))) ||
        // Added from remote for VULN-003
        lowerKey.includes("sensitive") || lowerKey.includes("maiden") || lowerKey.includes("zip") || lowerKey.includes("postcode")
      );

      if (isSensitiveKey) {
        sanitized[key] = "[REDACTED]";
      } else {
        // Skip properties already handled for Error
        if (isError && (key === "name" || key === "message" || key === "stack")) continue;
        sanitized[key] = sanitize(input[key], seen);
      }
    }
    return sanitized;
  }
  return input;
}

export const logger = {
  /**
   * Logs a high-level UI action or lifecycle event.
   * Essential for E2E tests to synchronize without arbitrary timeouts.
   */
  action: (name: string, data?: any) => {
    const sMsg = `[ACTION] ${name}`;
    const sData = data ? sanitize(data) : undefined;

    // Standard logging
    logger.info(sMsg, sData);

    // E2E Truth Tracking
    if (typeof window !== "undefined") {
      const win = window as any;
      if (!win.__TEST_MARKERS__) win.__TEST_MARKERS__ = [];
      win.__TEST_MARKERS__.push({
        name,
        data: sData,
        timestamp: Date.now(),
      });

      // Dispatch event for real-time listeners
      win.dispatchEvent(
        new CustomEvent("app:action", { detail: { name, data: sData } })
      );
    }
  },

  info: (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      info(sMsg, ...sArgs).catch(() => {});
    } else {
      console.info("[INFO]", sMsg, ...sArgs);
    }
  },
  error: (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      error(sMsg, ...sArgs).catch(() => {});
    } else {
      console.error("[ERROR]", sMsg, ...sArgs);
    }
  },
  warn: (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      warn(sMsg, ...sArgs).catch(() => {});
    } else {
      console.warn("[WARN]", sMsg, ...sArgs);
    }
  },
  debug: (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      debug(sMsg, ...sArgs).catch(() => {});
    } else {
      console.debug("[DEBUG]", sMsg, ...sArgs);
    }
  },
  log: (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      // @ts-ignore
      info(sMsg, ...sArgs).catch(() => {});
    } else {
      console.log(sMsg, ...sArgs);
    }
  },
};
