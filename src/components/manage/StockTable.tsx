import { Stock } from "@/lib";
import { FaEdit, FaTrash } from "react-icons/fa";
import GlobalTable from "@/components/ui/GlobalTable";

interface StockTableProps {
  stocks: Stock[];
  getProductName: (productId: number) => string;
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: number) => void;
}

export default function StockTable({
  stocks,
  getProductName,
  onEdit,
  onDelete,
}: StockTableProps) {
  return (
    <GlobalTable
      keyField="stock_id"
      data={stocks}
      emptyMessage="No stock entries found"
      columns={[
        {
          header: "ID",
          accessor: "stock_id",
          className: "text-muted-foreground w-[80px]",
        },
        {
          header: "Product",
          render: (stock) => (
            <span className="font-medium">{getProductName(stock.product_id)}</span>
          ),
        },
        {
          header: "Quantity",
          className: "font-mono tabular-nums",
          render: (stock) => (
            <span
              className={`rounded-md px-2 py-1 text-sm font-semibold ${
                stock.quantity > 0
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {stock.quantity}
            </span>
          ),
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (stock) => (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(stock)}
                className="text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-lg p-2 transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(stock.stock_id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}
