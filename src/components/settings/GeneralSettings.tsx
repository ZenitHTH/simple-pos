import { memo } from "react";
import { AppSettings, DeepPartial } from "@/lib";
import { open } from "@tauri-apps/plugin-dialog";
import { settingsApi } from "@/lib";
import { StorageInfo } from "@/lib";
import { FaFolderOpen, FaCog } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/settings/SettingsContext";
import SettingsSection from "@/components/ui/SettingsSection";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/utils/logger";

interface GeneralSettingsProps {
  // Props removed for performance (use context instead)
}

const GeneralSettings = memo(function GeneralSettings({}: GeneralSettingsProps) {
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const { 
    settings, 
    updateSettings, 
    storageInfo: cachedStorageInfo 
  } = useSettings(); 
  
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(cachedStorageInfo);
  const [isMigrating, setIsMigrating] = useState(false);

  const imageStoragePath = settings.storage.image_storage_path;
  const dbStoragePath = settings.storage.db_storage_path;

  const onUpdateSettings = useCallback((updates: DeepPartial<AppSettings>) => {
    updateSettings(updates);
  }, [updateSettings]);

  const handleSelectImageStorage = async () => {
    if (!dbKey) {
      showToast("You must be logged in to migrate images", "error");
      return;
    }

    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Image Storage Directory",
      });

      if (selected && typeof selected === "string") {
        if (!dbKey) {
          onUpdateSettings({ storage: { image_storage_path: selected } });
          return;
        }

        setIsMigrating(true);
        showToast("Migrating images to new location...", "info");
        try {
          await settingsApi.migrateImageDirectory(dbKey, selected);
          onUpdateSettings({ storage: { image_storage_path: selected } });
          showToast("Image migration successful", "success");
        } catch (error: any) {
          logger.error("Failed to migrate images:", error);
          showToast(`Migration failed: ${error.message || error}`, "error");
        } finally {
          setIsMigrating(false);
        }
      }
    } catch (error) {
      logger.error("Failed to select directory:", error);
    }
  };

  const handleResetStorage = async () => {
    if (!dbKey || !storageInfo) return;

    try {
      // Calculate default path from db_path
      const dbDir = storageInfo.db_path.substring(0, storageInfo.db_path.lastIndexOf("/"));
      const defaultPath = `${dbDir}/images`;

      setIsMigrating(true);
      showToast("Resetting images to default location...", "info");
      await settingsApi.migrateImageDirectory(dbKey, defaultPath);
      onUpdateSettings({ storage: { image_storage_path: undefined } });
      showToast("Images reset to default location", "success");
    } catch (error: any) {
      logger.error("Failed to reset images:", error);
      showToast(`Reset failed: ${error.message || error}`, "error");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <SettingsSection title="General Settings" icon={FaCog}>
      <div className="space-y-4">
        {/* Image Storage */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Image Storage</h4>
          <p className="text-muted-foreground text-xs">
            Saved to directory below. Default is app data.
          </p>
          <div className="flex items-center gap-2">
            <div className="bg-muted/30 border-border flex-1 truncate rounded-lg border px-3 py-2 font-mono text-xs">
              {imageStoragePath || storageInfo?.image_path || "Default (App Data)"}
            </div>
            <Button size="sm" onClick={handleSelectImageStorage} disabled={isMigrating}>
              {isMigrating ? "..." : "Browse"}
            </Button>
            {imageStoragePath && (
              <Button size="sm" variant="secondary" onClick={handleResetStorage}>Reset</Button>
            )}
          </div>
        </div>

        {/* Database Storage */}
        <div className="border-border space-y-2 border-t pt-4">
          <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Database Storage</h4>
          <div className="bg-warning/10 text-warning rounded-lg border border-warning/20 p-2 text-[10px] leading-tight">
            <strong>RESTART REQUIRED:</strong> Changing this requires moving 'database.db' manually.
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted/30 border-border flex-1 truncate rounded-lg border px-3 py-2 font-mono text-xs">
              {dbStoragePath || storageInfo?.db_path || "Default (App Data)"}
            </div>
            <Button
              size="sm"
              onClick={async () => {
                const selected = await open({ directory: true, multiple: false });
                if (selected && typeof selected === "string") onUpdateSettings({ storage: { db_storage_path: selected } });
              }}
            >
              Browse
            </Button>
            {dbStoragePath && (
              <Button size="sm" variant="secondary" onClick={() => onUpdateSettings({ storage: { db_storage_path: undefined } })}>Reset</Button>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

export default GeneralSettings;
