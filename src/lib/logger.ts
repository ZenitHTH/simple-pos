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
    return result;
  }

  if (typeof input === "object") {
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

    for (const key in input) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("tax") ||
        lowerKey.includes("address") ||
        lowerKey.includes("key") ||
        lowerKey.includes("customer") ||
        lowerKey.includes("email") ||
        lowerKey.includes("phone") ||
        lowerKey.includes("name") ||
        lowerKey.includes("dob") ||
        lowerKey.includes("birth") ||
        lowerKey.includes("national_id") ||
        lowerKey.includes("id_card") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("password") ||
        lowerKey.includes("sensitive") ||
        lowerKey.includes("ssn") ||
        lowerKey.includes("maiden") ||
        lowerKey.includes("card") ||
        lowerKey.includes("cvv") ||
        lowerKey.includes("cvc") ||
        lowerKey.includes("token") ||
        lowerKey.includes("auth") ||
        lowerKey.includes("zip") ||
        lowerKey.includes("postcode")
      ) {
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
