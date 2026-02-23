"use client";

import { useState } from "react";
import {
  FaBoxes,
  FaSearch,
  FaTrash,
  FaPlus,
  FaSave,
  FaBoxOpen,
} from "react-icons/fa";
import { useSimpleRecipe } from "@/app/manage/material/recipe/hooks/useSimpleRecipe";
import { cn } from "@/lib";

export default function SimpleRecipeBuilder({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const {
    products,
    materials,
    selectedProduct,
    recipeItems,
    loading,
    saving,
    error,
    successMsg,
    selectProduct,
    addMaterial,
    removeMaterial,
    updateItem,
    saveRecipe,
    setSelectedProduct,
  } = useSimpleRecipe({ onSaved });

  const [materialSearch, setMaterialSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(materialSearch.toLowerCase()),
  );

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const handleDragStart = (e: React.DragEvent, material: any) => {
    e.dataTransfer.setData("material", JSON.stringify(material));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const materialData = e.dataTransfer.getData("material");
    if (materialData) {
      try {
        const material = JSON.parse(materialData);
        addMaterial(material);
      } catch (err) {
        console.error("Failed to parse material data", err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner for Alerts */}
      {(error || successMsg) && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-top-2 rounded-xl p-3 text-sm font-medium",
            error
              ? "bg-destructive/10 text-destructive border-destructive/20 border"
              : "bg-success/10 text-success border-success/20 border",
          )}
        >
          {error || successMsg}
        </div>
      )}

      <div className="grid h-[600px] grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Materials */}
        <div className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm">
          <div className="border-border space-y-3 border-b p-4">
            <h3 className="text-foreground flex items-center gap-2 font-bold">
              <FaBoxes className="text-primary" /> Materials
            </h3>
            <div className="relative">
              <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-3 -translate-y-1/2 text-sm" />
              <input
                type="text"
                placeholder="Search materials..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="border-border bg-muted/30 focus:ring-primary/50 w-full rounded-lg border py-2 pr-3 pl-10 text-sm outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                draggable
                onDragStart={(e) => handleDragStart(e, material)}
                className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 group flex cursor-grab items-center justify-between rounded-xl border p-3 transition-all active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 text-xs">
                    <FaBoxes />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{material.name}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {material.quantity} {material.type_}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => addMaterial(material)}
                  className="text-primary hover:bg-primary/10 rounded-lg p-2 transition-colors"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>
            ))}
            {filteredMaterials.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-xs italic">
                No materials found
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Recipe Builder */}
        <div
          className={cn(
            "bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors",
            selectedProduct ? "border-primary/20" : "",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="border-border space-y-3 border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground flex items-center gap-2 font-bold">
                <FaBoxOpen className="text-secondary-foreground" />
                {selectedProduct
                  ? `Recipe for: ${selectedProduct.title}`
                  : "Select a Product"}
              </h3>
              {selectedProduct && (
                <button
                  onClick={saveRecipe}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <FaSave /> {saving ? "Saving..." : "Save Recipe"}
                </button>
              )}
            </div>

            {!selectedProduct ? (
              <div className="relative">
                <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-3 -translate-y-1/2 text-sm" />
                <input
                  type="text"
                  placeholder="Search products to build recipe..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/50 w-full rounded-lg border py-2 pr-3 pl-10 text-sm outline-none focus:ring-2"
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedProduct(null);
                }}
                className="text-primary text-[10px] font-bold tracking-wider uppercase hover:underline"
              >
                Change Product
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedProduct ? (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.product_id}
                    onClick={() => selectProduct(product)}
                    className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all"
                  >
                    <div className="bg-secondary/10 text-secondary-foreground rounded-lg p-2 text-xs">
                      <FaBoxOpen />
                    </div>
                    <span className="text-sm font-medium">{product.title}</span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center text-xs italic">
                    No products found
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recipeItems.map((item) => (
                  <div
                    key={item.material_id}
                    className="bg-muted/30 border-border animate-in zoom-in-95 flex items-center gap-4 rounded-xl border p-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.0001"
                        step="0.0001"
                        value={item.volume_use}
                        onChange={(e) =>
                          updateItem(
                            item.material_id,
                            parseFloat(e.target.value),
                            item.unit,
                          )
                        }
                        className="bg-background border-border focus:ring-primary/50 w-20 rounded-lg border px-2 py-1 text-center text-sm outline-none focus:ring-2"
                      />
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(
                            item.material_id,
                            item.volume_use,
                            e.target.value,
                          )
                        }
                        className="bg-background border-border focus:ring-primary/50 w-20 rounded-lg border px-2 py-1 text-center text-sm outline-none focus:ring-2"
                      />
                      <button
                        onClick={() => removeMaterial(item.material_id)}
                        className="text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}

                {recipeItems.length === 0 && (
                  <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
                    <FaBoxes className="text-muted-foreground/20 mb-3 text-4xl" />
                    <p className="text-muted-foreground text-sm font-medium">
                      Drag materials here to start your recipe
                    </p>
                    <p className="text-muted-foreground/60 text-[10px]">
                      Or click the + button on materials list
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
