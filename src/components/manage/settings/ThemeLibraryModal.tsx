"use client";

import { Modal } from "@/components/ui/Modal";
import { ThemePresetsPanel } from "@/components/design-tuner/panels/ThemePresetsPanel";
import { AppSettings, DeepPartial } from "@/lib/types";

interface ThemeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (updates: DeepPartial<AppSettings>) => void;
}

export default function ThemeLibraryModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
}: ThemeLibraryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Theme Library">
      <div className="p-6">
        <ThemePresetsPanel settings={settings} updateSettings={updateSettings} />
      </div>
    </Modal>
  );
}
