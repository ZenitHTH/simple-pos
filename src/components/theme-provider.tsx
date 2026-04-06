"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * A wrapper for next-themes ThemeProvider.
 * This component handles theme switching (light/dark/system) via CSS classes.
 * It is compatible with our manual CSS variable injection in SettingsContext 
 * because next-themes does not modify the inline 'style' attribute of the 
 * document element by default.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
