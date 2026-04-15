"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/Input";
import { DualColumnBuilder } from "@/components/ui/DualColumnBuilder";
import { logger } from "@/lib/utils/logger";

import {
  MaterialSourceItem,
  ProductSelectionItem,
  RecipeTargetItem,
} from "./RecipeBuilderComponents";

export default function SimpleRecipeBuilder({
  onSaved,
  split,
  onSplitChange,
}: {
  onSaved?: () => void;
  split?: number;
  onSplitChange?: (v: number) => void;
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
  const [showConnections, setShowConnections] = useState(true);

  // Connection line logic
  const [connections, setConnections] = useState<Array<{ d: string; id: number }>>([]);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const headerRef = useRef<HTMLDivElement>(null);

  const updateConnections = useCallback(() => {
    if (!showConnections || !selectedProduct || !rightPaneRef.current || !headerRef.current) {
      setConnections([]);
      return;
    }

    const paneRect = rightPaneRef.current.getBoundingClientRect();
    const headerRect = headerRef.current.getBoundingClientRect();
    
    // Start point: middle right of the product header
    const startX = headerRect.left - paneRect.left + headerRect.width;
    const startY = headerRect.top + headerRect.height / 2 - paneRect.top;

    const newConnections = recipeItems.map((item) => {
      const el = itemRefs.current.get(item.material_id);
      if (!el) return null;

      const elRect = el.getBoundingClientRect();
      // End point: middle left of the recipe item
      const endX = elRect.left - paneRect.left;
      const endY = elRect.top + elRect.height / 2 - paneRect.top;

      // Quadratic bezier curve
      const cp1x = startX + 40;
      const cp1y = startY;
      const cp2x = endX - 40;
      const cp2y = endY;

      return {
        id: item.material_id,
        d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
      };
    }).filter(Boolean) as Array<{ d: string; id: number }>;

    setConnections(newConnections);
  }, [showConnections, selectedProduct, recipeItems]);

  useLayoutEffect(() => {
    updateConnections();
    window.addEventListener("resize", updateConnections);
    return () => window.removeEventListener("resize", updateConnections);
  }, [updateConnections]);

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
        logger.error("Failed to parse material data", err);
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
        data.tags
      );
      await refreshMaterials();
      setIsMaterialModalOpen(false);
    } catch (err) {
      logger.error("Failed to create material", err);
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

      <DualColumnBuilder
        height="800px"
        split={split}
        onSplitChange={onSplitChange}
        leftPane={{
          header: (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
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
                <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-4 -translate-y-1/2 text-base z-10" />
                <Input
                  type="text"
                  placeholder="Search materials..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="pl-12"
                />
              </div>
            </>
          ),
          content: (
            <div className="space-y-2">
              {filteredMaterials.map((material) => (
                <MaterialSourceItem
                  key={material.id}
                  material={material}
                  onDragStart={handleDragStart}
                  onAdd={addMaterial}
                />
              ))}
              {filteredMaterials.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-sm italic">
                  No materials found
                </p>
              )}
            </div>
          ),
        }}
        rightPane={{
          isActive: !!selectedProduct,
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          header: (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
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
                  <FaSearch className="text-muted-foreground/50 absolute top-1/2 left-4 -translate-y-1/2 text-base z-10" />
                  <Input
                    type="text"
                    placeholder="Search products to build recipe..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-12"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-primary text-xs font-bold tracking-wider uppercase hover:underline"
                >
                  Change Product
                </button>
              )}
            </>
          ),
          content: (
            <div ref={rightPaneRef} className="relative h-full">
              {!selectedProduct ? (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <ProductSelectionItem
                      key={product.product_id}
                      product={product}
                      onSelect={selectProduct}
                    />
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
                    <RecipeTargetItem
                      key={item.material_id}
                      item={item}
                      onUpdate={updateItem}
                      onRemove={removeMaterial}
                    />
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
          ),
        }}
      />

      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSubmit={handleCreateMaterial}
        isSubmitting={isCreatingMaterial}
      />
    </div>
  );
}
