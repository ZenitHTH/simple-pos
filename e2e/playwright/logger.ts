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
