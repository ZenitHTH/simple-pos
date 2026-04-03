"use client";

import { useState, useEffect } from "react";
import DateFilter from "@/components/history/DateFilter";
import GlobalTable, { Column } from "@/components/ui/GlobalTable";
import { receiptApi } from "@/lib/api/receipts";
import { ProductAccumulation, MaterialAccumulation } from "@/lib/types/receipt";
import { logger } from "@/lib/logger";
import { useToast } from "@/context/ToastContext";
import { useDatabase } from "@/context/DatabaseContext";

export default function ReportPage() {
    const { showToast } = useToast();
    const { dbKey } = useDatabase();
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductAccumulation[]>([]);
    const [materials, setMaterials] = useState<MaterialAccumulation[]>([]);

    const fetchReport = async () => {
        if (!dbKey) return;
        setLoading(true);
        try {
            const startUnix = Math.floor(new Date(startDate).getTime() / 1000);
            const endUnix = Math.floor(new Date(endDate).getTime() / 1000) + 86399; // End of day

            const report = await receiptApi.getAccumulatedReport(dbKey, startUnix, endUnix);
            setProducts(report.products);
            setMaterials(report.materials);
        } catch (error) {
            await logger.error("Failed to fetch report:", error);
            showToast("Failed to fetch accumulated report", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dbKey) {
            fetchReport();
        }
    }, [dbKey]);

    const productColumns: Column<ProductAccumulation>[] = [
        {
            header: "Product",
            accessor: "title",
            className: "py-3",
        },
        {
            header: "Total Quantity",
            accessor: "total_quantity",
            className: "py-3 text-right font-mono",
            headerClassName: "text-right",
        },
    ];

    const materialColumns: Column<MaterialAccumulation>[] = [
        {
            header: "Material",
            accessor: "name",
            className: "py-3",
        },
        {
            header: "Total Volume Used",
            headerClassName: "text-right",
            className: "py-3 text-right font-mono",
            render: (m) => (m.total_volume_used / Math.pow(10, m.precision)).toFixed(m.precision),
        },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Accumulated Sales & Stock Report</h1>
                <p className="text-muted-foreground mt-2">
                    View summarized sales and material usage over a selected period.
                </p>
            </div>

            <DateFilter
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onFilter={fetchReport}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Products Sold Table */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Products Sold</h2>
                    <GlobalTable
                        columns={productColumns}
                        data={products}
                        keyField="product_id"
                        emptyMessage="No sales data found for this period."
                    />
                </div>

                {/* Materials Used Table */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Materials Used</h2>
                    <GlobalTable
                        columns={materialColumns}
                        data={materials}
                        keyField="material_id"
                        emptyMessage="No material usage recorded for this period."
                    />
                </div>
            </div>
        </div>
    );
}
