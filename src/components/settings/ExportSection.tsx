"use client";

import { useState } from "react";
import { receiptApi } from "@/lib";
import { FaFileExport, FaFolderOpen } from "react-icons/fa";
import { save } from "@tauri-apps/plugin-dialog";
import SettingsSection from "@/components/ui/SettingsSection";
import { Select } from "@/components/ui/Select";
import { logger } from "@/lib/utils/logger";
import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";

/**
 * ExportSection Component
 * 
 * @param {Object} props - The properties object.
 * @returns {JSX.Element | null} The rendered component.
 */
export default function ExportSection() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  // Default: Last 30 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [format, setFormat] = useState("csv");
  const [reportType, setReportType] = useState("sales_tax");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const start = Math.floor(new Date(startDate).getTime() / 1000);
    const end = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

    const performExport = async (ext: string, label: string) => {
      // Starting export process
      const path = await save({
        filters: [{ name: label, extensions: [ext] }],
        defaultPath: `receipts_${reportType}_${startDate}_${endDate}.${ext}`,
      });
      if (!path || !dbKey) return;

      await receiptApi.exportReceipts(dbKey, path, ext, start, end);
      await showAlert("Export", `${label} Export successful!`);
    };

    try {
      switch (format) {
        case "csv":
          await performExport("csv", "CSV");
          break;
        case "xlsx":
          await performExport("xlsx", "Excel");
          break;
        case "ods":
          await performExport("ods", "OpenDocument");
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      logger.error(`Export failed for format ${format}:`, error);
      await showAlert("Export Error", `Export failed for ${format.toUpperCase()}: ` + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection title="Export Data" icon={FaFileExport}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(value) => setReportType(value as string)}
            options={[
              {
                value: "sales_tax",
                label: "Sales Tax Report (รายงานภาษีขาย)",
              },
              {
                value: "sales_detail",
                label: "Sales Detail Report (รายละเอียดการขาย)",
              },
            ]}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              <p>Date Range</p>
            </label>
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2"
              />
              <span className="text-muted-foreground self-center">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-2 outline-none focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {["csv", "xlsx", "ods"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-xl border px-4 py-2 font-medium uppercase transition-[background-color,border-color,color] ${
format === f
                    ? "bg-primary text-primary-foreground border-primary shadow-primary/20 shadow-lg"
                    : "bg-background border-border hover:bg-muted/10 text-muted-foreground"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {format === "ods" && (
              <p className="text-warning mt-2 text-xs">
                Note: ODS export is experimental.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-lg transition-colors hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Exporting..."
            ) : (
              <>
                <FaFolderOpen /> Export to File
              </>
            )}
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
