import { memo } from "react";
import { AppSettings, DeepPartial } from "@/lib";
import { open } from "@tauri-apps/plugin-dialog";
import { settingsApi } from "@/lib";
import { StorageInfo } from "@/lib";
import { FaFolderOpen, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";
import SettingsSection from "@/components/ui/SettingsSection";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";

interface GeneralSettingsProps {
  imageStoragePath?: string;
  dbStoragePath?: string;
  onUpdateSettings: (updates: DeepPartial<AppSettings>) => void;
}

const GeneralSettings = memo(function GeneralSettings({
  imageStoragePath,
  dbStoragePath,
  onUpdateSettings,
}: GeneralSettingsProps) {
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    settingsApi.getStorageInfo().then(setStorageInfo).catch(logger.error);
  }, []);

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
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Image Storage</h3>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              Product images will be saved to this directory. If not set, the
              default application data directory is used.
            </label>
            <div className="flex items-center gap-3">
              <div className="bg-muted/30 border-border flex-1 truncate rounded-lg border p-3 font-mono text-sm">
                {imageStoragePath || (
                  <span className="text-muted-foreground italic">
                    {storageInfo?.image_path || "Default (App Data)"}
                  </span>
                )}
              </div>
              <Button
                onClick={handleSelectImageStorage}
                className="gap-2"
                disabled={isMigrating}
              >
                <FaFolderOpen />
                {isMigrating ? "Migrating..." : "Browse"}
              </Button>
              {imageStoragePath && (
                <Button variant="secondary" onClick={handleResetStorage}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="border-border space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold">Database Storage</h3>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              The application database (database.db) will be stored in this
              directory.
            </label>
            <div className="border-warning/20 bg-warning/10 text-warning rounded-lg border p-3 text-sm">
              <strong>Note:</strong> Changing this setting requires an
              application restart. You must manually move your existing
              &apos;database.db&apos; to the new location, or a new empty
              database will be created.
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted/30 border-border flex-1 truncate rounded-lg border p-3 font-mono text-sm">
                {dbStoragePath || (
                  <span className="text-muted-foreground italic">
                    {storageInfo?.db_path || "Default (App Data)"}
                  </span>
                )}
              </div>
              <Button
                onClick={async () => {
                  try {
                    const selected = await open({
                      directory: true,
                      multiple: false,
                      title: "Select Database Storage Directory",
                    });

                    if (selected && typeof selected === "string") {
                      onUpdateSettings({ storage: { db_storage_path: selected } });
                    }
                  } catch (error) {
                    logger.error("Failed to select directory:", error);
                  }
                }}
                className="gap-2"
              >
                <FaFolderOpen />
                Browse
              </Button>
              {dbStoragePath && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    onUpdateSettings({ storage: { db_storage_path: undefined } })
                  }
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
});

export default GeneralSettings;
