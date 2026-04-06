import React from "react";

/**
 * Parses a packed image position string "X% Y%|Scale" into React CSS.
 * If the string has no scale, it gracefully falls back to scale 1.
 */
export function parseImageStyle(
  imagePositionString?: string | null,
): React.CSSProperties {
  if (!imagePositionString) {
    return { objectPosition: "center", transform: "scale(1)" };
  }

  const parts = imagePositionString.split("|");
  const objectPosition = parts[0] || "center";
  const scale = parts.length > 1 ? parseFloat(parts[1]) : 1;

  // Validate scale to prevent broken CSS
  const validScale = isNaN(scale) ? 1 : scale;

  return {
    objectPosition,
    transform: `scale(${validScale})`,
    transformOrigin: objectPosition,
  };
}
