"use client";

import { FaPlus, FaProjectDiagram } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import StockModal from "@/components/manage/StockModal";
import { useStockManagement } from "./hooks/useStockManagement";
import StockTable from "@/components/manage/StockTable";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";

// New imports for unification
import { useMaterialManagement } from "../material/hooks/useMaterialManagement";
import MaterialTable from "@/components/manage/MaterialTable";
import MaterialModal from "@/components/manage/MaterialModal";
import { useSearchParams, useRouter } from "next/navigation";

export default function StockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "materials" ? "materials" : "products";
  const [activeTab, setActiveTab] = useState<"products" | "materials">(
    initialTab,
  );

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "materials") {
      setActiveTab("materials");
    } else {
      setActiveTab("products");
    }
  }, [searchParams]);

  const {
    stocks,
    products,
    loading: stockLoading,
    error: stockError,
    searchQuery: stockSearch,
    setSearchQuery: setStockSearch,
    isModalOpen: isStockModalOpen,
    setIsModalOpen: setIsStockModalOpen,
    editingStock,
    isSubmitting: isStockSubmitting,
    getProductName,
    handleCreate: handleStockCreate,
    handleEdit: handleStockEdit,
    handleDelete: handleStockDelete,
    handleModalSubmit: handleStockModalSubmit,
  } = useStockManagement();

  const {
    materials,
    loading: materialLoading,
    error: materialError,
    searchQuery: materialSearch,
    setSearchQuery: setMaterialSearch,
    isModalOpen: isMaterialModalOpen,
    setIsModalOpen: setIsMaterialModalOpen,
    editingMaterial,
    isSubmitting: isMaterialSubmitting,
    handleCreate: handleMaterialCreate,
    handleEdit: handleMaterialEdit,
    handleDelete: handleMaterialDelete,
    handleModalSubmit: handleMaterialModalSubmit,
  } = useMaterialManagement();

  const loading = activeTab === "products" ? stockLoading : materialLoading;
  const error =
    activeTab === "products" ? stockError : materialError || undefined;
  const searchQuery = activeTab === "products" ? stockSearch : materialSearch;
  const setSearchQuery =
    activeTab === "products" ? setStockSearch : setMaterialSearch;

  const handleTabChange = (tab: "products" | "materials") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <ManagementPageLayout
      title="Inventory Management"
      subtitle={
        activeTab === "products"
          ? "Manage your product stock levels"
          : "Manage your raw materials and ingredients"
      }
      headerActions={
        <div className="flex items-center gap-3">
          {activeTab === "materials" && (
            <Link
              href="/manage/material/recipe"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-medium transition-all"
            >
              <FaProjectDiagram />
              <span>Recipe Builder</span>
            </Link>
          )}
          <button
            onClick={
              activeTab === "products"
                ? handleStockCreate
                : handleMaterialCreate
            }
            className={`${
              activeTab === "products"
                ? "bg-primary shadow-primary/20"
                : "bg-blue-600 text-white shadow-blue-200"
            } flex items-center gap-2 rounded-xl px-4 py-2 shadow-lg transition-all hover:opacity-90 active:scale-95`}
          >
            <FaPlus />
            <span>
              {activeTab === "products"
                ? "Add Product Stock"
                : "Add Raw Material"}
            </span>
          </button>
        </div>
      }
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      scaleKey={
        activeTab === "products" ? "stock_table_scale" : "manage_table_scale"
      }
      modal={
        activeTab === "products" ? (
          <StockModal
            isOpen={isStockModalOpen}
            onClose={() => setIsStockModalOpen(false)}
            onSubmit={handleStockModalSubmit}
            initialData={editingStock}
            products={products}
            isSubmitting={isStockSubmitting}
          />
        ) : (
          <MaterialModal
            isOpen={isMaterialModalOpen}
            onClose={() => setIsMaterialModalOpen(false)}
            onSubmit={handleMaterialModalSubmit}
            initialData={editingMaterial}
            isSubmitting={isMaterialSubmitting}
          />
        )
      }
    >
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleTabChange("products")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "products"
              ? "bg-primary font-bold text-white shadow-md"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Product Stock
        </button>
        <button
          onClick={() => handleTabChange("materials")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "materials"
              ? "bg-blue-600 font-bold text-white shadow-md"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Raw Materials
        </button>
      </div>

      {activeTab === "products" ? (
        <StockTable
          stocks={stocks}
          getProductName={getProductName}
          onEdit={handleStockEdit}
          onDelete={handleStockDelete}
        />
      ) : (
        <MaterialTable
          materials={materials}
          onEdit={handleMaterialEdit}
          onDelete={handleMaterialDelete}
        />
      )}
    </ManagementPageLayout>
  );
}
