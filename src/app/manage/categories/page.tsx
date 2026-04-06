"use client";

import { FaPlus } from "react-icons/fa";
import CategoryModal from "@/components/manage/CategoryModal";
import { useSettings } from "@/context/SettingsContext";
import { useCategoryManagement } from "./hooks/useCategoryManagement";
import CategoryTable from "@/components/manage/CategoryTable";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";

export default function CategoriesPage() {
  const { settings } = useSettings();
  const {
    categories,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalSubmit,
  } = useCategoryManagement();

  return (
    <ManagementPageLayout
      title="Category Management"
      subtitle="Manage product categories"
      headerActions={
        <button
          onClick={handleCreate}
          className="bg-primary shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-white shadow-lg transition-all"
        >
          <FaPlus />
          <span>New Category</span>
        </button>
      }
      loading={loading}
      error={error}
      scaleKey="category_table_scale"
      modal={
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={editingCategory}
          isSubmitting={isSubmitting}
        />
      }
    >
      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        settings={settings}
      />
    </ManagementPageLayout>
  );
}
