"use client";

import { useTheme } from "next-themes";
import { FaPalette, FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import SettingsSection from "@/components/ui/SettingsSection";
import { useEffect, useState } from "react";

export default function ThemeSettings() {
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
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 ${
                theme === "light" ? "ring-primary/20 ring-2" : ""
              }`}
            >
              <FaSun className="text-2xl" />
              <span className="font-medium">Light</span>
            </Button>

            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 ${
                theme === "dark" ? "ring-primary/20 ring-2" : ""
              }`}
            >
              <FaMoon className="text-2xl" />
              <span className="font-medium">Dark</span>
            </Button>

            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className={`flex h-auto flex-col items-center justify-center gap-2 p-4 ${
                theme === "system" ? "ring-primary/20 ring-2" : ""
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
}
