/**
 * Converts a scaled integer (significand and precision) to a floating point number.
 * e.g. (12345, 4) -> 1.2345
 */
export function scaledToFloat(significand: number, precision: number): number {
  if (!precision || precision <= 0) return significand;
  return significand / Math.pow(10, precision);
}

/**
 * Formats a scaled integer for display with up to 4 decimal places.
 */
export function formatVolume(significand: number, precision: number): string {
  const float = scaledToFloat(significand, precision);
  // Remove trailing zeros and unnecessary decimal point
  return parseFloat(float.toFixed(4)).toString();
}
