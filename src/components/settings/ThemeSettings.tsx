"use client";

import { useTheme } from "next-themes";
import { FaPalette, FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import SettingsSection from "@/components/ui/SettingsSection";
import { useEffect, useState, memo } from "react";

/**
 * ThemeSettings Component
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
const ThemeSettings = memo(function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SettingsSection title="Appearance" icon={FaPalette}>
      <div className="space-y-4">
        <div>
          <label className="text-muted-foreground mb-2 block text-sm font-medium">
            Theme Preference
          </label>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setTheme("light")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 transition-colors ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary ring-primary/20 shadow-sm ring-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaSun className="text-2xl" />
              <span className="font-medium">Light</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setTheme("dark")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 transition-colors ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary ring-primary/20 shadow-sm ring-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaMoon className="text-2xl" />
              <span className="font-medium">Dark</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setTheme("system")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 transition-colors ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary ring-primary/20 shadow-sm ring-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FaDesktop className="text-2xl" />
              <span className="font-medium">System</span>
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Choose a theme for the application. System theme will match your
          operating system&apos;s preference.
        </p>
      </div>
    </SettingsSection>
  );
});

export default ThemeSettings;
