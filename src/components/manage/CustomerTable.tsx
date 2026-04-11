import { FaEdit } from "react-icons/fa";
import { Customer, AppSettings } from "@/lib";
import GlobalTable, { Column } from "@/components/ui/GlobalTable";
import { Button } from "@/components/ui/Button";

interface CustomerTableProps {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    settings: AppSettings;
}

export default function CustomerTable({
    customers,
    onEdit,
    settings,
}: CustomerTableProps) {
    const fontScale = (settings.scaling.fonts.manage_table || 100) / 100;

    const columns: Column<Customer>[] = [
        {
            header: "Customer Name",
            accessor: "name",
        },
        {
            header: "Tax ID",
            render: (c) => c.tax_id || "-",
        },
        {
            header: "Branch",
            render: (c) => (c.branch === "00000" ? "Head Office" : c.branch),
        },
        {
            header: "Address",
            render: (c) => c.address || "-",
        },
        {
            header: "Actions",
            headerClassName: "text-right",
            className: "text-right",
            render: (c) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(c)}
                    title="Edit Customer"
                >
                    <FaEdit size={18 * fontScale} />
                </Button>
            ),
        },
    ];

    return (
        <div style={{ fontSize: `${0.875 * fontScale}rem` }}>
            <GlobalTable
                columns={columns}
                data={customers}
                keyField="id"
                emptyMessage='No customers found. Click "New Customer" to add one.'
            />
        </div>
    );
}
