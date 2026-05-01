"use client";

import { useState } from "react";
import { useSettings } from "@/context/settings/SettingsContext";
import { FaTrash, FaSave, FaUndo } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

/**
 * SettingsActions Component
 * Handles manual saving, undoing, and resetting of global settings.
 */
export default function SettingsActions() {
  const {
    resetToDefault,
    save,
    isSaving,
    hasUnsavedChanges,
    resetToCheckpoint,
  } = useSettings();
  const [showWarning, setShowWarning] = useState(false);
  const { showToast } = useToast();

  const handleResetDefaults = () => {
    resetToDefault();
    setShowWarning(false);
    showToast(
      "Settings reset to default. Click Save to apply permanently.",
      "info",
    );
  };

  const handleSave = async () => {
    try {
      await save();
      showToast("Settings saved successfully.", "success");
    } catch (e) {
      showToast("Failed to save settings.", "error");
    }
  };

  const handleRevert = () => {
    resetToCheckpoint();
    showToast("Reverted to last saved state.", "info");
  };

  return (
    <div className="flex items-center gap-3">
      {hasUnsavedChanges && (
        <button
          onClick={handleRevert}
          className="border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
          title="Revert to last saved state"
        >
          <FaUndo size={14} />
          <span className="hidden sm:inline">Revert</span>
        </button>
      )}

      <button
        onClick={() => setShowWarning(true)}
        className="border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
      >
        <FaTrash size={14} />
        <span className="hidden sm:inline">Reset</span>
      </button>

      <button
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isSaving}
        className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all ${
          hasUnsavedChanges
            ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg hover:scale-105 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
        }`}
      >
        <FaSave size={14} />
        {isSaving ? "Saving..." : "Save Changes"}
      </button>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-card border-border animate-in fade-in zoom-in w-full max-w-sm overflow-hidden rounded-xl border p-6 shadow-2xl duration-200">
            <h3 className="text-destructive mb-2 text-lg font-bold">
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
                className="bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90 rounded-lg px-4 py-2 font-bold shadow-lg transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
