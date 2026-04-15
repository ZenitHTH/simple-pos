import { Category } from "@/lib";
import { FaEdit, FaTrash } from "react-icons/fa";
import GlobalTable from "@/components/ui/GlobalTable";
import { AppSettings } from "@/lib";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  settings: AppSettings;
}

/**
 * CategoryTable component displays a list of product categories in a tabular format.
 * It provides actions to edit or delete each category.
 * 
 * @param {CategoryTableProps} props - The component props.
 * @param {Category[]} props.categories - List of categories to display.
 * @param {(category: Category) => void} props.onEdit - Callback when the edit button is clicked.
 * @param {(id: number) => void} props.onDelete - Callback when the delete button is clicked.
 * @param {AppSettings} props.settings - Application settings (not currently used in the implementation but passed in props).
 */
export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <GlobalTable
      keyField="id"
      data={categories}
      emptyMessage="No categories found"
      columns={[
        {
          header: "ID",
          accessor: "id",
          className: "text-muted-foreground w-[80px]",
        },
        { header: "Name", accessor: "name", className: "font-medium" },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (cat) => (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit(cat)}
                className="hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-lg p-2 transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(cat.id)}
                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg p-2 transition-colors"
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
