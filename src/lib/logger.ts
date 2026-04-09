import { info, error, warn, debug } from "@tauri-apps/plugin-log";

// We check if the environment has Tauri available
// Using typeof window ensures we don't crash in SSR (Next.js server)
const isTauri = () => {
  // @ts-ignore
  return typeof window !== "undefined" && window.__TAURI__ !== undefined;
};

/**
 * Basic PII Redaction with Circular Reference protection
 * Redacts 13-digit numbers (likely Thai Tax IDs) and masks sensitive patterns.
 */
export function sanitize(input: any, seen = new WeakSet()): any {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    // Redact 13-digit numbers
    return input.replace(/\b\d{13}\b/g, "[REDACTED-ID]");
  }

  if (typeof input === "object") {
    if (seen.has(input)) return "[Circular]";
    seen.add(input);

    const sanitized: any = Array.isArray(input) ? [] : {};
    for (const key in input) {
      if (
        key.toLowerCase().includes("tax") ||
        key.toLowerCase().includes("address") ||
        key.toLowerCase().includes("key")
      ) {
        sanitized[key] = "[REDACTED]";
      } else {
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
