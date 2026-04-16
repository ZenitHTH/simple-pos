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
  info: async (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      await info(sMsg, ...sArgs);
    } else {
      console.info("[INFO]", sMsg, ...sArgs);
    }
  },
  error: async (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      await error(sMsg, ...sArgs);
    } else {
      console.error("[ERROR]", sMsg, ...sArgs);
    }
  },
  warn: async (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      await warn(sMsg, ...sArgs);
    } else {
      console.warn("[WARN]", sMsg, ...sArgs);
    }
  },
  debug: async (message: string, ...args: any[]) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    if (isTauri()) {
      await debug(sMsg, ...sArgs);
    } else {
      console.debug("[DEBUG]", sMsg, ...sArgs);
    }
  },
};
