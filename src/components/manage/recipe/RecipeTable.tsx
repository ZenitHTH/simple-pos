"use client";

import { BackendProduct, Material, formatVolume } from "@/lib";
import { RecipeItem, RecipeList } from "@/lib/types/recipe";
import GlobalTable, { Column } from "@/components/ui/GlobalTable";

interface RecipeRow {
  product: BackendProduct;
  list: RecipeList;
  items: RecipeItem[];
  materials: Material[];
}

interface RecipeTableProps {
  recipeRows: RecipeRow[];
}

interface MaterialWithItem {
  item: RecipeItem;
  mat: Material | undefined;
}

export default function RecipeTable({ recipeRows }: RecipeTableProps) {
  const columns: Column<MaterialWithItem>[] = [
    {
      header: "Material",
      render: (data) => data.mat?.name ?? `Material #${data.item.material_id}`,
      className: "font-medium",
    },
    {
      header: "Type",
      render: (data) => data.mat?.type_ ?? "—",
      className: "text-muted-foreground",
    },
    {
      header: "Qty",
      accessor: "item",
      render: (data) => (
        <span className="block w-full text-right font-mono">
          {formatVolume(data.item.volume_use, data.item.volume_use_precision)}
        </span>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
    {
      header: "Unit",
      render: (data) => data.item.unit,
    },
  ];

  if (recipeRows.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No saved recipes yet. Save a recipe from the canvas above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {recipeRows.map(({ product, list, items, materials }) => {
        const productMaterials: MaterialWithItem[] = items.map((item) => {
          const mat = materials.find((m) => m.id === item.material_id);
          return { item, mat };
        });

        return (
          <div key={list.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-base font-bold">
                {product.title}
              </h3>
              <span className="text-muted-foreground text-xs">
                {productMaterials.length} materials
              </span>
            </div>
            <GlobalTable
              columns={columns}
              data={productMaterials}
              keyField="item"
              emptyMessage="No materials linked."
            />
          </div>
        );
      })}
    </div>
  );
}
