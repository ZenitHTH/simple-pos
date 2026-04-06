"use client";

import { FONT_FAMILIES } from "@/lib/constants/typography";

interface TypographyPreviewProps {
  fontFamily: string;
  baseSize: number;
  headingWeight: number;
  bodyWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export function TypographyPreview({
  fontFamily,
  baseSize,
  headingWeight,
  bodyWeight,
  lineHeight,
  letterSpacing,
}: TypographyPreviewProps) {
  const previewStyle = {
    fontFamily,
    lineHeight,
    letterSpacing: `${letterSpacing}em`,
    fontSize: `${baseSize}px`,
  };

  const fontLabel =
    FONT_FAMILIES.find((f) => f.value === fontFamily)?.label || fontFamily;

  return (
    <div
      className="border-border bg-card space-y-5 rounded-2xl border p-6 shadow-sm"
      style={previewStyle}
    >
      <h3
        className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase"
        style={{ fontFamily: "inherit", fontWeight: 600 }}
      >
        Live Preview
      </h3>

      <div
        style={{
          fontSize: `${baseSize * 2.5}px`,
          fontWeight: headingWeight,
        }}
        className="leading-tight tracking-tight"
      >
        Heading 1
      </div>

      <div
        style={{
          fontSize: `${baseSize * 1.875}px`,
          fontWeight: headingWeight,
        }}
      >
        Heading 2
      </div>

      <div
        style={{
          fontSize: `${baseSize * 1.5}px`,
          fontWeight: headingWeight,
        }}
      >
        Heading 3
      </div>

      <div className="border-border border-t pt-4">
        <p
          style={{
            fontWeight: bodyWeight,
            fontSize: `${baseSize}px`,
          }}
        >
          The quick brown fox jumps over the lazy dog. This is body text styled
          for readability at your current settings.
        </p>
      </div>

      <p
        className="text-muted-foreground"
        style={{
          fontSize: `${baseSize * 0.875}px`,
          fontWeight: bodyWeight,
        }}
      >
        Small text for captions, timestamps, or secondary info.
      </p>

      <div className="border-border bg-muted/30 mt-4 rounded-xl border p-3">
        <p
          className="font-mono text-xs"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          family: {fontLabel}
          {" · "}base: {baseSize}px{" · "}
          h-weight: {headingWeight}
          {" · "}
          lh: {lineHeight.toFixed(2)}
          {" · "}
          ls:{" "}
          {letterSpacing === 0
            ? "0"
            : `${letterSpacing > 0 ? "+" : ""}${letterSpacing.toFixed(3)}`}
          em
        </p>
      </div>
    </div>
  );
}
