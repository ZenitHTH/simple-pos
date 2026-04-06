"use client";

import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { FaTrash } from "react-icons/fa";

export default function ResetSettingsButton() {
  const { resetToDefault } = useSettings();
  const [showWarning, setShowWarning] = useState(false);

  const handleResetDefaults = () => {
    resetToDefault();
    setShowWarning(false);
  };

  return (
    <>
      <button
        onClick={() => setShowWarning(true)}
        className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20"
      >
        <FaTrash size={14} />
        Reset to Default
      </button>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-card border-border animate-in fade-in zoom-in w-full max-w-sm overflow-hidden rounded-xl border p-6 shadow-2xl duration-200">
            <h3 className="mb-2 text-lg font-bold text-destructive">
              Warning: Reset Settings
            </h3>
            <p className="text-muted mb-6">
              Are you sure you want to reset all settings to their defaults? You
              will need to click &apos;Save Changes&apos; to persist this
              action.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="text-foreground hover:bg-muted/10 rounded-lg px-4 py-2 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDefaults}
                className="rounded-lg bg-destructive px-4 py-2 font-bold text-destructive-foreground shadow-lg shadow-destructive/20 transition-colors hover:bg-destructive/90"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
