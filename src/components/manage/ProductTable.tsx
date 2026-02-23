import { useRouter } from "next/navigation";
import { convertFileSrc } from "@/lib/api/invoke";
import { BackendProduct, Category } from "@/lib";
import { FaEdit, FaTrash, FaImage, FaUtensils } from "react-icons/fa";
import GlobalTable from "@/components/ui/GlobalTable";
import { AppSettings } from "@/lib";

interface ProductTableProps {
  products: (BackendProduct & { image_path?: string })[];
  categories: Category[];
  onEdit: (product: BackendProduct) => void;
  onDelete: (id: number) => void;
  settings: AppSettings;
}

export default function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
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
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm font-medium">
                {cat ? cat.name : "Unknown"}
              </span>
            );
          },
        },
        {
          header: "Price",
          className: "font-mono tabular-nums",
          render: (product) => `฿${(product.satang / 100).toFixed(2)}`,
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (product) => (
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/manage/material/recipe?product_id=${product.product_id}`,
                  )
                }
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg p-2 transition-colors"
                title="Create Recipe"
              >
                <FaUtensils />
              </button>
              <button
                onClick={() => onEdit(product)}
                className="text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-lg p-2 transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(product.product_id)}
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
