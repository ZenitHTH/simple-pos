"use client";

import { useState, useEffect } from "react";
import { FaFileImport, FaFileExport, FaCaretDown } from "react-icons/fa";
import { save, open } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import { stockApi } from "@/lib";
import { useDatabase } from "@/context/DatabaseContext";
import { useToast } from "@/context/ToastContext";
import { logger } from "@/lib/utils/logger";

interface ImportExportControlsProps {
  onRefresh: () => void;
}

export default function ImportExportControls({
  onRefresh,
}: ImportExportControlsProps) {
  const { dbKey } = useDatabase();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  useEffect(() => {
    let unlisten: any;
    const setupListener = async () => {
      unlisten = await listen<number>("import-progress", (event) => {
        setImportProgress(event.payload);
      });
    };
    setupListener();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleExport = async (format: "csv" | "xlsx" | "ods") => {
    if (!dbKey) return;
    setIsExporting(true);

    try {
      const path = await save({
        filters: [
          {
            name: format.toUpperCase(),
            extensions: [format],
          },
        ],
        defaultPath: `stock_export.${format}`,
      });

      if (path) {
        await stockApi.exportData(dbKey, path, format);
        showToast(
          `Stock exported to ${format.toUpperCase()} successfully`,
          "success",
        );
      }
    } catch (error) {
      logger.error("Export failed:", error);
      showToast("Export failed. See logs for details.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!dbKey) return;
    setIsImporting(true);
    setImportProgress(0);

    try {
      const path = await open({
        multiple: false,
        filters: [
          {
            name: "Spreadsheets",
            extensions: ["csv", "xlsx", "ods"],
          },
        ],
      });

      if (path && typeof path === "string") {
        const format = path.split(".").pop()?.toLowerCase() || "csv";
        const count = await stockApi.importData(dbKey, path, format);
        showToast(`Imported ${count} stock records successfully`, "success");
        onRefresh();
      }
    } catch (error) {
      logger.error("Import failed:", error);
      showToast(`Import failed: ${error}`, "error");
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isImporting && (
        <div className="flex w-48 items-center gap-3">
          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
          <span className="text-muted-foreground text-[10px] font-bold whitespace-nowrap">
            {importProgress}%
          </span>
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={isImporting}
        className="bg-muted hover:bg-muted/80 text-foreground flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
      >
        <FaFileImport className={isImporting ? "animate-pulse" : ""} />
        <span>{isImporting ? "Importing..." : "Import"}</span>
      </button>

      <div className="group relative">
        <button
          disabled={isExporting}
          className="bg-muted hover:bg-muted/80 text-foreground flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          <FaFileExport className={isExporting ? "animate-pulse" : ""} />
          <span>{isExporting ? "Exporting..." : "Export"}</span>
          <FaCaretDown className="text-[10px] opacity-50" />
        </button>

        {/* Dropdown Menu */}
        <div className="bg-card border-border invisible absolute top-full right-0 z-50 mt-2 min-w-[120px] origin-top-right scale-95 rounded-xl border p-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
          <button
            onClick={() => handleExport("csv")}
            className="hover:bg-muted w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
          >
            CSV Format
          </button>
          <button
            onClick={() => handleExport("xlsx")}
            className="hover:bg-muted w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
          >
            Excel (XLSX)
          </button>
          <button
            onClick={() => handleExport("ods")}
            className="hover:bg-muted w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
          >
            OpenDocument (ODS)
          </button>
        </div>
      </div>
    </div>
  );
}
