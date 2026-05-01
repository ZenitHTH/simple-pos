import { useState, useEffect } from "react";
import { categoryApi } from "@/lib";
import { Category } from "@/lib";
import { logger } from "@/lib/utils/logger";

import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { useDataCache } from "@/context/DataContext";

export function useCategoryManagement() {
  const { dbKey } = useDatabase();
  const { showAlert } = useAlert();
  const { categories, updateCache, refreshAll } = useDataCache();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?") || !dbKey)
      return;
    try {
      await categoryApi.delete(dbKey, id);
      updateCache.categories(categories.filter((c) => c.id !== id));
    } catch (err) {
      logger.error("Failed to delete category:", err);
      await showAlert("Category Error", "Failed to delete category");
    }
  };

  const handleModalSubmit = async (name: string) => {
    if (!dbKey) return;
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        const updated = await categoryApi.update(dbKey, {
          ...editingCategory,
          name,
        });
        updateCache.categories(
          categories.map((c) => (c.id === updated.id ? updated : c)),
        );
        logger.action("category_updated", { id: updated.id });
      } else {
        const created = await categoryApi.create(dbKey, name);
        updateCache.categories([...categories, created]);
        logger.action("category_created", { id: created.id });
      }
      setIsModalOpen(false);
    } catch (err) {
      logger.error("Failed to save category:", err);
      await showAlert("Category Error", "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    refresh: refreshAll,
  };
}
