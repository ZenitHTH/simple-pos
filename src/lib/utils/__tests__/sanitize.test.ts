import { sanitize } from "../../logger";

describe("sanitize", () => {
  it("should redact 13-digit IDs in strings", () => {
    expect(sanitize("ID: 1234567890123")).toBe("ID: [REDACTED-ID]");
  });

  it("should redact emails in strings", () => {
    expect(sanitize("Contact test@example.com")).toBe(
      "Contact [REDACTED-EMAIL]",
    );
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
