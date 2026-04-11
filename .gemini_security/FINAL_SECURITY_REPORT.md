### Newly Introduced Vulnerabilities

#### ID: VULN-001
**Vulnerability:** Prototype Pollution in `deepMerge`
**Vulnerability Type:** Security
**Severity:** High
**Source Location:** `src/lib/utils/deepMerge.ts`
**Line Numbers:** 7-7
**Line Content:** `for (const key in source) {`
**Description:** The `deepMerge` function is vulnerable to Prototype Pollution because it does not validate keys when merging objects. An attacker who can influence the `source` object (e.g., through malicious settings data) can provide a `__proto__` or `constructor` key to add or modify properties on `Object.prototype`, which can lead to application-wide behavior changes, denial of service, or potentially remote code execution/XSS depending on how the polluted properties are used.
**Recommendation:** Add a check to skip sensitive keys like `__proto__`, `constructor`, and `prototype` during the merge process.

#### ID: VULN-002
**Vulnerability:** Incomplete PII Redaction in Logger (Privacy Leak)
**Vulnerability Type:** Privacy
**Severity:** Medium
**Source Location:** `src/lib/logger.ts`
**Line Numbers:** 29-29
**Line Content:** `key.toLowerCase().includes("tax") ||` (and subsequent lines in deny-list)
**Description:** The `sanitize` function in `logger.ts` uses a deny-list approach to redact sensitive information (PII). This approach is inherently fragile as it only redacts values if their keys are explicitly listed. New PII fields or variations in key naming will not be redacted, leading to potential leaks of sensitive data (email, name, etc.) into logs. Additionally, it does not handle non-enumerable properties of objects like `Error.message`, which are commonly passed to loggers.
**Recommendation:** Adopt a more robust sanitization strategy, such as allow-listing safe keys or using a more comprehensive redaction library. For error objects, ensure the `message` and `stack` properties are explicitly sanitized.
