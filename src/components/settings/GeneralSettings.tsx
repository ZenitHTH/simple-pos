import { memo } from "react";
import { AppSettings } from "@/lib";
import { open } from "@tauri-apps/plugin-dialog";
import { settingsApi } from "@/lib";
import { StorageInfo } from "@/lib";
import { FaFolderOpen, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import SettingsSection from "@/components/ui/SettingsSection";
import { Button } from "@/components/ui/Button";

interface GeneralSettingsProps {
  imageStoragePath?: string;
  dbStoragePath?: string;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
}

const GeneralSettings = memo(function GeneralSettings({
  imageStoragePath,
  dbStoragePath,
  onUpdateSettings,
}: GeneralSettingsProps) {
  const { dbKey } = useDatabase();
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    settingsApi.getStorageInfo().then(setStorageInfo).catch(console.error);
  }, []);

  const handleSelectImageStorage = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Image Storage Directory",
      });

      if (selected && typeof selected === "string") {
        if (dbKey) {
          setIsMigrating(true);
          try {
            await settingsApi.migrateImageDirectory(dbKey, selected);
            onUpdateSettings({ image_storage_path: selected });
          } catch (err) {
            console.error("Migration failed:", err);
            alert("Failed to migrate images to new directory.");
          } finally {
            setIsMigrating(false);
          }
        } else {
          onUpdateSettings({ image_storage_path: selected });
        }
      }
    } catch (error) {
      console.error("Failed to specify directory:", error);
    }
  };

  const handleResetStorage = () => {
    onUpdateSettings({ image_storage_path: undefined });
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
                      onUpdateSettings({ db_storage_path: selected });
                    }
                  } catch (error) {
                    console.error("Failed to select directory:", error);
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
                    onUpdateSettings({ db_storage_path: undefined })
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
