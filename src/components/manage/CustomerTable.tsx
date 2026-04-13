import { FaEdit } from "react-icons/fa";
import { Customer, AppSettings } from "@/lib";
import GlobalTable, { Column } from "@/components/ui/GlobalTable";
import { Button } from "@/components/ui/Button";

interface CustomerTableProps {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    settings: AppSettings;
}

/**
 * CustomerTable component displays a list of customers in a tabular format.
 * It includes customer name, tax ID, branch, and address, with an action to edit.
 * 
 * @param {CustomerTableProps} props - The component props.
 * @param {Customer[]} props.customers - List of customers to display.
 * @param {(customer: Customer) => void} props.onEdit - Callback when the edit button is clicked.
 * @param {AppSettings} props.settings - Application settings for font scaling.
 */
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
