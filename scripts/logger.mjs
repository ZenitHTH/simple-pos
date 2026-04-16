/**
 * Ported from src/lib/utils/logger.ts for use in Node.js scripts (E2E runner).
 * Provides consistent PII redaction.
 */

/**
 * Basic PII Redaction with Circular Reference protection
 * Redacts sensitive patterns and masks sensitive object keys.
 */
export function sanitize(input, seen = new WeakSet()) {
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
  if (input !== null && typeof input === "object" && (input.constructor === Object || Array.isArray(input) || input instanceof Error)) {
    if (seen.has(input)) return "[Circular]";
    seen.add(input);

    const isError = input instanceof Error;
    const sanitized = Array.isArray(input) ? [] : {};

    if (isError) {
      sanitized.name = input.name;
      sanitized.message = sanitize(input.message, seen);
      sanitized.stack = sanitize(input.stack, seen);
    }

    for (const key of Object.keys(input)) {
      const lowerKey = key.toLowerCase();
      const isSensitiveKey = (
        (lowerKey === "key" || lowerKey === "secret" || lowerKey === "password" || lowerKey === "token" || lowerKey === "auth") ||
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
  info: (message, ...args) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    console.info("[INFO]", sMsg, ...sArgs);
  },
  error: (message, ...args) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    console.error("[ERROR]", sMsg, ...sArgs);
  },
  warn: (message, ...args) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    console.warn("[WARN]", sMsg, ...sArgs);
  },
  debug: (message, ...args) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    console.debug("[DEBUG]", sMsg, ...sArgs);
  },
  log: (message, ...args) => {
    const sMsg = sanitize(message);
    const sArgs = args.map((a) => sanitize(a));
    console.log(sMsg, ...sArgs);
  }
};
