"use client";

import { useState } from 'react';
import { receiptApi } from '@/lib/api';
import { FaFileExport, FaFolderOpen } from 'react-icons/fa';
import { save } from '@tauri-apps/plugin-dialog';

export default function ExportSection() {
    // Default: Last 30 days
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [format, setFormat] = useState('csv');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        const start = Math.floor(new Date(startDate).getTime() / 1000);
        const end = Math.floor(new Date(endDate).getTime() / 1000) + 86399;

        const performExport = async (ext: string, label: string) => {
            console.log(`Starting ${label} Export...`);
            const path = await save({
                filters: [{ name: label, extensions: [ext] }],
                defaultPath: `receipts_export_${startDate}_${endDate}.${ext}`
            });
            if (!path) return;

            await receiptApi.exportReceipts(path, ext, start, end);
            alert(`${label} Export successful!`);
        };

        try {
            switch (format) {
                case 'csv':
                    await performExport('csv', 'CSV');
                    break;
                case 'xlsx':
                    await performExport('xlsx', 'Excel');
                    break;
                case 'ods':
                    await performExport('ods', 'OpenDocument');
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
        } catch (error) {
            console.error(`Export failed for format ${format}:`, error);
            alert(`Export failed for ${format.toUpperCase()}: ` + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card-bg rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <FaFileExport size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Export Data</h2>
                    <p className="text-muted text-sm">Export receipt history to spreadsheet files</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Date Range</label>
                        <div className="flex gap-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <span className="self-center text-muted">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['csv', 'xlsx', 'ods'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`px-4 py-2 rounded-xl border transition-all font-medium uppercase ${format === f
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-blue-500/20'
                                        : 'bg-background border-border hover:bg-muted/10 text-muted'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        {format === 'ods' && (
                            <p className="text-xs text-yellow-500 mt-2">
                                Note: ODS export is experimental.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-end">
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Exporting...' : <><FaFolderOpen /> Export to File</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
