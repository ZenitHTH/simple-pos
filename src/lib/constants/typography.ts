// --- Typography Constants ---

export const FONT_FAMILIES = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Prompt", value: "'Prompt', sans-serif" },
  { label: "Kanit", value: "'Kanit', sans-serif" },
  { label: "Sarabun", value: "'Sarabun', sans-serif" },
  {
    label: "Noto Sans (Thai/Intl)",
    value: "'Noto Sans Thai', 'Noto Sans', sans-serif",
  },
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
];

export const WEIGHT_OPTIONS = [
  { label: "Thin", value: 100 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extrabold", value: 800 },
  { label: "Black", value: 900 },
];

// --- Defaults (mirrors SettingsContext) ---
export const TYPOGRAPHY_DEFAULTS = {
  fontFamily: "Inter, sans-serif",
  baseSize: 16,
  headingWeight: 700,
  bodyWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
} as const;
