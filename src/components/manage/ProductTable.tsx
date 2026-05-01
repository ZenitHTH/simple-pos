import { useRouter } from "next/navigation";
import { convertFileSrc } from "@/lib/api/invoke";
import { BackendProduct, Category, cn } from "@/lib";
import { FaEdit, FaTrash, FaImage, FaUtensils, FaBoxes } from "react-icons/fa";
import GlobalTable from "@/components/ui/GlobalTable";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { TableActionButton } from "@/components/ui/TableActionButton";
import { AppSettings } from "@/lib";

interface ProductTableProps {
  products: (BackendProduct & { image_path?: string })[];
  categories: Category[];
  onEdit: (product: BackendProduct) => void;
  onDelete: (id: number) => void;
  onToggleStockMode: (id: number, current: boolean) => void;
  settings: AppSettings;
}

/**
 * ProductTable component displays a list of products in a tabular format with detailed information.
 * It shows images, titles, categories, prices, and provides actions for editing, deleting, and managing stock/recipes.
 *
 * @param {ProductTableProps} props - The component props.
 * @param {(BackendProduct & { image_path?: string })[]} props.products - List of products to display, including optional image path.
 * @param {Category[]} props.categories - List of all categories for display name lookup.
 * @param {(product: BackendProduct) => void} props.onEdit - Callback when the edit button is clicked.
 * @param {(id: number) => void} props.onDelete - Callback when the delete button is clicked.
 * @param {(id: number, current: boolean) => void} props.onToggleStockMode - Callback to toggle between normal and recipe stock modes.
 * @param {AppSettings} props.settings - Application settings for currency display.
 */
export default function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
  onToggleStockMode,
  settings,
}: ProductTableProps) {
  const router = useRouter();

  return (
    <GlobalTable
      keyField="product_id"
      data={products}
      emptyMessage="No products found"
      columns={[
        {
          header: "Image",
          className: "w-[60px]",
          render: (product) => (
            <div className="bg-muted flex h-10 w-10 overflow-hidden rounded-lg border">
              {product.image_path ? (
                <img
                  src={convertFileSrc(product.image_path)}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: product.image_object_position || "center",
                  }}
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <FaImage size={16} />
                </div>
              )}
            </div>
          ),
        },
        {
          header: "ID",
          accessor: "product_id",
          className: "text-muted-foreground w-[80px]",
        },
        { header: "Title", accessor: "title", className: "font-medium" },
        {
          header: "Category",
          render: (product) => {
            const cat = categories.find((c) => c.id === product.category_id);
            return (
              <Badge variant="primary-subtle">
                {cat ? cat.name : "Unknown"}
              </Badge>
            );
          },
        },
        {
          header: "Price",
          className: "font-mono tabular-nums",
          render: (product) =>
            `${settings.general.currency_symbol}${(product.satang / 100).toFixed(2)}`,
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (product) => (
            <div className="flex justify-end gap-2">
              <Switch
                checked={product.use_recipe_stock}
                onClick={() =>
                  onToggleStockMode(
                    product.product_id,
                    product.use_recipe_stock,
                  )
                }
                title={
                  product.use_recipe_stock
                    ? "Stock Mode: Recipe"
                    : "Stock Mode: Normal"
                }
              />
              <TableActionButton
                onClick={() =>
                  router.push(
                    product.use_recipe_stock
                      ? `/manage/material/recipe?product_id=${product.product_id}`
                      : `/manage/stock?product_id=${product.product_id}`,
                  )
                }
                title={
                  product.use_recipe_stock ? "Manage Recipe" : "Manage Stock"
                }
                icon={product.use_recipe_stock ? <FaUtensils /> : <FaBoxes />}
              />
              <TableActionButton
                onClick={() => onEdit(product)}
                title="Edit"
                icon={<FaEdit />}
              />
              <TableActionButton
                onClick={() => onDelete(product.product_id)}
                title="Delete"
                variant="destructive"
                icon={<FaTrash />}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
