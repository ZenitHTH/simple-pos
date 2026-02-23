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
import { cn, materialApi } from "@/lib";
import MaterialModal from "@/components/manage/MaterialModal";
import { useDatabase } from "@/context/DatabaseContext";

export default function SimpleRecipeBuilder({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const { dbKey } = useDatabase();
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
    refreshMaterials,
  } = useSimpleRecipe({ onSaved });

  const [materialSearch, setMaterialSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);

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

  const handleCreateMaterial = async (data: any) => {
    if (!dbKey) return;
    try {
      setIsCreatingMaterial(true);
      await materialApi.create(
        dbKey,
        data.name,
        data.type_,
        data.volume,
        data.quantity,
      );
      await refreshMaterials();
      setIsMaterialModalOpen(false);
    } catch (err) {
      console.error("Failed to create material", err);
    } finally {
      setIsCreatingMaterial(false);
    }
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

      <div className="grid h-[800px] grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Materials */}
        <div className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm">
          <div className="border-border space-y-3 border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground flex items-center gap-2 font-bold text-lg">
                <FaBoxes className="text-primary" /> Materials
              </h3>
              <button
                onClick={() => setIsMaterialModalOpen(true)}
                className="text-primary hover:bg-primary/10 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
                title="Create Material"
              >
                <FaPlus /> <span>New Material</span>
              </button>
            </div>
            <div className="relative">
              <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-4 -translate-y-1/2 text-base" />
              <input
                type="text"
                placeholder="Search materials..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="border-border bg-muted/30 focus:ring-primary/50 w-full rounded-xl border py-3 pr-4 pl-12 text-base outline-none focus:ring-2"
              />
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                draggable
                onDragStart={(e) => handleDragStart(e, material)}
                className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 group flex cursor-grab items-center justify-between rounded-xl border p-4 transition-all active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5 text-base">
                    <FaBoxes />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      {material.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {material.quantity} {material.type_}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => addMaterial(material)}
                  className="bg-primary/5 text-primary hover:bg-primary/20 rounded-xl p-3 transition-colors"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
            ))}
            {filteredMaterials.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm italic">
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
              <h3 className="text-foreground flex items-center gap-2 font-bold text-lg">
                <FaBoxOpen className="text-secondary-foreground" />
                {selectedProduct
                  ? `Recipe for: ${selectedProduct.title}`
                  : "Select a Product"}
              </h3>
              {selectedProduct && (
                <button
                  onClick={saveRecipe}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <FaSave /> {saving ? "Saving..." : "Save Recipe"}
                </button>
              )}
            </div>

            {!selectedProduct ? (
              <div className="relative">
                <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-4 -translate-y-1/2 text-base" />
                <input
                  type="text"
                  placeholder="Search products to build recipe..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/50 w-full rounded-xl border py-3 pr-4 pl-12 text-base outline-none focus:ring-2"
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedProduct(null);
                }}
                className="text-primary text-xs font-bold tracking-wider uppercase hover:underline"
              >
                Change Product
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {!selectedProduct ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.product_id}
                    onClick={() => selectProduct(product)}
                    className="bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all"
                  >
                    <div className="bg-secondary/10 text-secondary-foreground rounded-lg p-3 text-lg">
                      <FaBoxOpen />
                    </div>
                    <span className="text-base font-semibold">
                      {product.title}
                    </span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center text-sm italic">
                    No products found
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recipeItems.map((item) => (
                  <div
                    key={item.material_id}
                    className="bg-muted/10 border-border animate-in zoom-in-95 flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-bold">{item.name}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">
                          Volume
                        </label>
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
                          className="bg-background border-border focus:ring-primary/50 h-11 w-24 rounded-xl border px-3 text-center text-base font-medium outline-none focus:ring-2"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-muted-foreground text-[10px] font-bold uppercase">
                          Unit
                        </label>
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
                          className="bg-background border-border focus:ring-primary/50 h-11 w-28 rounded-xl border px-3 text-center text-base font-medium outline-none focus:ring-2"
                        />
                      </div>
                      <button
                        onClick={() => removeMaterial(item.material_id)}
                        className="text-destructive hover:bg-destructive/10 mt-5 h-11 w-11 rounded-xl transition-colors sm:mt-4"
                      >
                        <FaTrash className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}

                {recipeItems.length === 0 && (
                  <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-32 text-center">
                    <FaBoxes className="text-muted-foreground/10 mb-6 text-7xl" />
                    <p className="text-muted-foreground text-lg font-bold">
                      Drag materials here to start your recipe
                    </p>
                    <p className="text-muted-foreground/60 text-sm">
                      Or click the + button on materials list
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSubmit={handleCreateMaterial}
        isSubmitting={isCreatingMaterial}
      />
    </div>
  );
}
